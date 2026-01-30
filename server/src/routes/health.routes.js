const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

// GET /api/health - Full health check
router.get('/', healthController.getHealthStatus);

// GET /api/health/ping - Simple ping
router.get('/ping', healthController.ping);

module.exports = router;
