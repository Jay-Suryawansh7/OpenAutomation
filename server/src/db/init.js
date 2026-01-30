#!/usr/bin/env node
/**
 * Database Initialization Script
 * Run this to create all required tables in your Neon PostgreSQL database
 * 
 * Usage: npm run db:init
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool, testConnection, closePool } = require('../config/db');

async function initDatabase() {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                     Instagram Automation - Database Init                       ║
╚═══════════════════════════════════════════════════════════════════════════════╝
  `);

    // Check for DATABASE_URL
    if (!process.env.DATABASE_URL) {
        console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
        console.error('   Please add your Neon connection string to .env file');
        process.exit(1);
    }

    console.log('🔄 Connecting to Neon PostgreSQL...\n');

    // Test connection first
    const connected = await testConnection();
    if (!connected) {
        console.error('❌ Failed to connect to database. Check your DATABASE_URL.');
        process.exit(1);
    }

    console.log('\n📦 Reading schema file...');

    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');

    if (!fs.existsSync(schemaPath)) {
        console.error('❌ Schema file not found at:', schemaPath);
        process.exit(1);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('   ✓ Schema file loaded\n');

    console.log('🚀 Executing schema...\n');

    const client = await pool.connect();

    try {
        // Begin transaction
        await client.query('BEGIN');

        // Execute the schema
        await client.query(schema);

        // Commit transaction
        await client.query('COMMIT');

        console.log('   ✓ Tables created successfully\n');

        // Verify tables were created
        console.log('🔍 Verifying tables...\n');

        const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

        console.log('   Created tables:');
        tables.rows.forEach(row => {
            console.log(`   ├─ ${row.table_name}`);
        });

        // Show indexes
        const indexes = await client.query(`
      SELECT indexname, tablename
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND indexname LIKE 'idx_%'
      ORDER BY tablename, indexname;
    `);

        console.log('\n   Created indexes:');
        indexes.rows.forEach(row => {
            console.log(`   ├─ ${row.indexname} (on ${row.tablename})`);
        });

        console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                        ✅ Database initialized successfully!                  ║
╚═══════════════════════════════════════════════════════════════════════════════╝

  Your database is ready. Tables created:
  • users       - App admin (synced with Clerk)
  • leads       - Instagram users who comment
  • conversations - Comments and bot replies

  Next steps:
  1. Start your server: npm run dev
  2. Configure your Instagram webhook
    `);

    } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        console.error('❌ Schema execution failed:', error.message);
        console.error('\n   Full error:', error);
        process.exit(1);
    } finally {
        client.release();
        await closePool();
    }
}

// Run the initialization
initDatabase().catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
