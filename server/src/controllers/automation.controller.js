const automationService = require('../services/automation.service');

/**
 * Get all automations for the authenticated user
 */
const getAutomations = async (req, res, next) => {
    try {
        const userId = req.auth?.userId;
        const automations = await automationService.getAutomationsByUser(userId);

        res.json({
            success: true,
            data: automations,
            count: automations.length
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get a single automation by ID
 */
const getAutomationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.auth?.userId;

        const automation = await automationService.getAutomationById(id, userId);

        if (!automation) {
            return res.status(404).json({
                success: false,
                error: 'Automation not found'
            });
        }

        res.json({
            success: true,
            data: automation
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new automation
 */
const createAutomation = async (req, res, next) => {
    try {
        const userId = req.auth?.userId;
        const automationData = { ...req.body, userId };

        const automation = await automationService.createAutomation(automationData);

        res.status(201).json({
            success: true,
            data: automation,
            message: 'Automation created successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update an automation
 */
const updateAutomation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.auth?.userId;
        const updates = req.body;

        const automation = await automationService.updateAutomation(id, userId, updates);

        if (!automation) {
            return res.status(404).json({
                success: false,
                error: 'Automation not found'
            });
        }

        res.json({
            success: true,
            data: automation,
            message: 'Automation updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete an automation
 */
const deleteAutomation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.auth?.userId;

        const deleted = await automationService.deleteAutomation(id, userId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Automation not found'
            });
        }

        res.json({
            success: true,
            message: 'Automation deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Toggle automation status (active/inactive)
 */
const toggleAutomation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.auth?.userId;

        const automation = await automationService.toggleAutomation(id, userId);

        if (!automation) {
            return res.status(404).json({
                success: false,
                error: 'Automation not found'
            });
        }

        res.json({
            success: true,
            data: automation,
            message: `Automation ${automation.isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAutomations,
    getAutomationById,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    toggleAutomation
};
