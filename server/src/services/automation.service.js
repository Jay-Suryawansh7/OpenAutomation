const { query } = require('../config/database');

/**
 * Get all automations for a user
 */
const getAutomationsByUser = async (userId) => {
    const result = await query(
        `SELECT * FROM automations WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
};

/**
 * Get a single automation by ID
 */
const getAutomationById = async (id, userId) => {
    const result = await query(
        `SELECT * FROM automations WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );
    return result.rows[0] || null;
};

/**
 * Create a new automation
 */
const createAutomation = async (data) => {
    const { userId, name, trigger, action, config, isActive = true } = data;

    const result = await query(
        `INSERT INTO automations (user_id, name, trigger, action, config, is_active, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
     RETURNING *`,
        [userId, name, trigger, action, JSON.stringify(config), isActive]
    );

    return result.rows[0];
};

/**
 * Update an automation
 */
const updateAutomation = async (id, userId, updates) => {
    const { name, trigger, action, config, isActive } = updates;

    const result = await query(
        `UPDATE automations 
     SET name = COALESCE($3, name),
         trigger = COALESCE($4, trigger),
         action = COALESCE($5, action),
         config = COALESCE($6, config),
         is_active = COALESCE($7, is_active),
         updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
        [id, userId, name, trigger, action, config ? JSON.stringify(config) : null, isActive]
    );

    return result.rows[0] || null;
};

/**
 * Delete an automation
 */
const deleteAutomation = async (id, userId) => {
    const result = await query(
        `DELETE FROM automations WHERE id = $1 AND user_id = $2 RETURNING id`,
        [id, userId]
    );
    return result.rowCount > 0;
};

/**
 * Toggle automation active status
 */
const toggleAutomation = async (id, userId) => {
    const result = await query(
        `UPDATE automations 
     SET is_active = NOT is_active, updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
        [id, userId]
    );
    return result.rows[0] || null;
};

module.exports = {
    getAutomationsByUser,
    getAutomationById,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    toggleAutomation
};
