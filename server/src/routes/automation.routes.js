const express = require('express');
const router = express.Router();
const automationController = require('../controllers/automation.controller');
const { authMiddleware } = require('../middleware/auth');

// All automation routes require authentication
router.use(authMiddleware);

// GET /api/automations - Get all automations
router.get('/', automationController.getAutomations);

// GET /api/automations/:id - Get single automation
router.get('/:id', automationController.getAutomationById);

// POST /api/automations - Create new automation
router.post('/', automationController.createAutomation);

// PUT /api/automations/:id - Update automation
router.put('/:id', automationController.updateAutomation);

// DELETE /api/automations/:id - Delete automation
router.delete('/:id', automationController.deleteAutomation);

// PATCH /api/automations/:id/toggle - Toggle automation status
router.patch('/:id/toggle', automationController.toggleAutomation);

module.exports = router;
