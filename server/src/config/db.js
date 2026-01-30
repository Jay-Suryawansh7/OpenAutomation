const { Pool } = require('pg');

// ═══════════════════════════════════════════════════════════════════════════════
// Neon PostgreSQL Connection Pool
// ═══════════════════════════════════════════════════════════════════════════════

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    // SSL Configuration (required for Neon)
    ssl: {
        rejectUnauthorized: true  // Neon uses valid SSL certs, so we can verify
    },

    // Connection pool settings
    max: 10,                    // Maximum connections in pool
    idleTimeoutMillis: 30000,   // Close idle connections after 30s
    connectionTimeoutMillis: 10000  // Timeout after 10s if connection fails
});

// ─────────────────────────────────────────────────────────────────────────────
// Connection Event Handlers
// ─────────────────────────────────────────────────────────────────────────────
pool.on('connect', (client) => {
    console.log('📦 New client connected to Neon PostgreSQL');
});

pool.on('error', (err, client) => {
    console.error('❌ Unexpected error on idle PostgreSQL client:', err.message);
});

// ─────────────────────────────────────────────────────────────────────────────
// Query Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Execute a parameterized query
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<QueryResult>} Query result
 */
const query = async (text, params = []) => {
    const start = Date.now();

    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;

        if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Query:', {
                text: text.substring(0, 80).replace(/\n/g, ' '),
                duration: `${duration}ms`,
                rows: result.rowCount
            });
        }

        return result;
    } catch (error) {
        console.error('❌ Query failed:', error.message);
        throw error;
    }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise<PoolClient>} A client from the pool
 */
const getClient = async () => {
    const client = await pool.connect();
    return client;
};

/**
 * Test the database connection
 * @returns {Promise<boolean>} True if connection successful
 */
const testConnection = async () => {
    try {
        const result = await query('SELECT NOW() as now, current_database() as db');
        console.log('✅ Database connected:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

/**
 * Close the connection pool gracefully
 */
const closePool = async () => {
    await pool.end();
    console.log('📦 Database pool closed');
};

module.exports = {
    pool,
    query,
    getClient,
    testConnection,
    closePool
};
