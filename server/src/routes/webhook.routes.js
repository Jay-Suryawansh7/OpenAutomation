const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// GET /api/webhooks/instagram - Verify webhook subscription
router.get('/instagram', webhookController.verifyWebhook);

// POST /api/webhooks/instagram - Handle incoming webhook events
router.post('/instagram', webhookController.handleWebhook);

module.exports = router;
