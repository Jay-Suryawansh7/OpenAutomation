const { testConnection } = require('../config/database');

/**
 * Health check controller
 */
const getHealthStatus = async (req, res) => {
    try {
        const dbStatus = await testConnection();

        const healthStatus = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            services: {
                database: dbStatus ? 'connected' : 'disconnected',
                api: 'running'
            }
        };

        const statusCode = dbStatus ? 200 : 503;
        res.status(statusCode).json(healthStatus);
    } catch (error) {
        res.status(503).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
};

/**
 * Simple ping endpoint
 */
const ping = (req, res) => {
    res.json({ message: 'pong', timestamp: new Date().toISOString() });
};

module.exports = {
    getHealthStatus,
    ping
};
