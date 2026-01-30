const config = require('../config');
const crypto = require('crypto');

/**
 * Verify Instagram webhook subscription
 */
const verifyWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === config.meta.verifyToken) {
        console.log('✅ Webhook verified successfully');
        res.status(200).send(challenge);
    } else {
        console.warn('⚠️ Webhook verification failed');
        res.sendStatus(403);
    }
};

/**
 * Handle incoming Instagram webhook events
 */
const handleWebhook = async (req, res) => {
    // Verify signature
    const signature = req.headers['x-hub-signature-256'];
    if (!verifySignature(req.body, signature)) {
        console.warn('⚠️ Invalid webhook signature');
        return res.sendStatus(401);
    }

    const body = req.body;

    if (body.object === 'instagram') {
        // Process each entry
        body.entry?.forEach((entry) => {
            console.log('📨 Received webhook entry:', JSON.stringify(entry, null, 2));

            // Handle messaging events
            if (entry.messaging) {
                entry.messaging.forEach((event) => {
                    processMessagingEvent(event);
                });
            }

            // Handle changes (comments, mentions, etc.)
            if (entry.changes) {
                entry.changes.forEach((change) => {
                    processChangeEvent(change);
                });
            }
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
};

/**
 * Verify webhook signature
 */
const verifySignature = (payload, signature) => {
    if (!signature || !config.meta.appSecret) {
        return false;
    }

    const expectedSignature = crypto
        .createHmac('sha256', config.meta.appSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

    return signature === `sha256=${expectedSignature}`;
};

/**
 * Process messaging events (DMs)
 */
const processMessagingEvent = (event) => {
    const senderId = event.sender?.id;
    const message = event.message;

    if (message?.text) {
        console.log(`💬 Message from ${senderId}: ${message.text}`);
        // TODO: Trigger automation based on message content
    }
};

/**
 * Process change events (comments, mentions)
 */
const processChangeEvent = (change) => {
    const field = change.field;
    const value = change.value;

    console.log(`📝 Change event - Field: ${field}`, value);
    // TODO: Trigger automation based on change type
};

module.exports = {
    verifyWebhook,
    handleWebhook
};
