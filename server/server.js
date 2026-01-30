require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');

// Import route modules
const healthRoutes = require('./src/routes/health.routes');
const webhookRoutes = require('./src/routes/webhookRoutes');
const automationRoutes = require('./src/routes/automation.routes');

// Import middleware
const { errorHandler } = require('./src/middleware/errorHandler');
const { notFound } = require('./src/middleware/notFound');
const { clerkAuthMiddleware } = require('./src/middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// ─────────────────────────────────────────────────────────────────────────────
// Security & Parsing Middleware
// ─────────────────────────────────────────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─────────────────────────────────────────────────────────────────────────────
// Logging Middleware
// ─────────────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// ─────────────────────────────────────────────────────────────────────────────
// Keep-Alive Health Check (Public - No Auth Required)
// Used by Render to check service health and for self-ping
// ─────────────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'alive',
        timestamp: Date.now(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Route (before Clerk auth - Meta needs to access it)
// ─────────────────────────────────────────────────────────────────────────────
app.use('/webhook', webhookRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// Clerk Authentication (adds auth to all requests after this point)
// ─────────────────────────────────────────────────────────────────────────────
app.use(clerkAuthMiddleware);

// ─────────────────────────────────────────────────────────────────────────────
// API Routes (Protected)
// ─────────────────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/automations', automationRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// Error Handling
// ─────────────────────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
// Keep-Alive Self-Ping (Prevent Render Free Tier Sleep)
// Pings itself every 14 minutes to stay awake
// ─────────────────────────────────────────────────────────────────────────────
const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds
let keepAliveTimer = null;

const startKeepAlive = () => {
    const appUrl = process.env.APP_URL;

    if (!appUrl) {
        console.log('⚠️  APP_URL not set - Keep-alive self-ping disabled');
        console.log('   Set APP_URL in .env to enable (e.g., https://your-app.onrender.com)');
        return;
    }

    console.log(`🔄 Keep-alive enabled: Self-ping every 14 minutes to ${appUrl}/health`);

    keepAliveTimer = setInterval(async () => {
        try {
            const response = await axios.get(`${appUrl}/health`, {
                timeout: 10000 // 10 second timeout
            });
            console.log(`💓 Keep-alive ping successful: ${response.data.status} (uptime: ${Math.floor(response.data.uptime)}s)`);
        } catch (error) {
            // Don't crash the server on ping failure
            console.warn(`⚠️  Keep-alive ping failed: ${error.message}`);
        }
    }, KEEP_ALIVE_INTERVAL);

    // Prevent the timer from keeping the Node.js process alive on shutdown
    keepAliveTimer.unref();
};

// ─────────────────────────────────────────────────────────────────────────────
// Server Initialization
// ─────────────────────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
    console.log(`
  ┌─────────────────────────────────────────────────────────┐
  │                                                         │
  │   🚀 Instagram Automation API Server                    │
  │                                                         │
  │   ► Local:   http://localhost:${PORT}                    │
  │   ► Health:  http://localhost:${PORT}/health              │
  │   ► Mode:    ${process.env.NODE_ENV || 'development'}                             │
  │                                                         │
  └─────────────────────────────────────────────────────────┘
  `);

    // Start keep-alive after server is running
    startKeepAlive();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');

    // Clear keep-alive timer
    if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
        console.log('Keep-alive timer cleared.');
    }

    server.close(() => {
        console.log('Process terminated.');
        process.exit(0);
    });
});

module.exports = app;
