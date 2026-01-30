const express = require('express');
const router = express.Router();
const { handleNewComment } = require('../services/instagramService');

// ═══════════════════════════════════════════════════════════════════════════════
// Instagram Graph API Webhook Routes
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /webhook
 * Meta Webhook Verification Challenge
 * 
 * When you configure the webhook in Meta Developer Console, Meta sends a GET
 * request with these query parameters to verify your endpoint:
 * - hub.mode: Should be 'subscribe'
 * - hub.verify_token: Your custom token (must match META_VERIFY_TOKEN in .env)
 * - hub.challenge: A random string that must be echoed back
 */
router.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('📩 Webhook verification request received');
    console.log('   Mode:', mode);
    console.log('   Token:', token ? '***' + token.slice(-4) : 'missing');
    console.log('   Challenge:', challenge ? 'present' : 'missing');

    // Check if mode and token are correct
    if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
        console.log('✅ Webhook verified successfully!');

        // Respond with the challenge integer to confirm subscription
        return res.status(200).send(parseInt(challenge));
    }

    // Verification failed
    console.warn('⚠️ Webhook verification failed - invalid mode or token');
    return res.status(403).json({
        error: 'Verification failed',
        message: 'Invalid verify token or mode'
    });
});

/**
 * POST /webhook
 * Handle incoming webhook events from Instagram
 * 
 * This receives notifications for:
 * - Comments on your posts (field: 'comments')
 * - Direct messages (messaging array)
 * - Mentions
 * - Story replies
 * 
 * Instagram webhook payload structure for comments:
 * {
 *   "object": "instagram",
 *   "entry": [{
 *     "id": "INSTAGRAM_BUSINESS_ACCOUNT_ID",
 *     "time": 1234567890,
 *     "changes": [{
 *       "field": "comments",
 *       "value": {
 *         "id": "COMMENT_ID",
 *         "text": "The actual comment text",
 *         "from": {
 *           "id": "USER_ID",
 *           "username": "commenter_username"
 *         },
 *         "media": {
 *           "id": "MEDIA_ID",
 *           "media_product_type": "REELS" | "FEED"
 *         }
 *       }
 *     }]
 *   }]
 * }
 */
router.post('/', (req, res) => {
    // Immediately respond to satisfy Meta's timeout limits (< 20 seconds)
    // Process async to avoid blocking
    res.status(200).send('EVENT_RECEIVED');

    const body = req.body;

    console.log('\n════════════════════════════════════════════════════════════');
    console.log('📨 WEBHOOK EVENT RECEIVED');
    console.log('════════════════════════════════════════════════════════════');
    console.log('Raw payload:', JSON.stringify(body, null, 2));

    // Verify this is from Instagram
    if (body.object !== 'instagram') {
        console.warn('⚠️ Received webhook from unknown source:', body.object);
        return;
    }

    // Process each entry
    if (!body.entry || body.entry.length === 0) {
        console.log('No entries in webhook payload');
        return;
    }

    body.entry.forEach((entry, entryIndex) => {
        console.log(`\n📦 Entry ${entryIndex + 1}:`, {
            id: entry.id,
            time: new Date(entry.time * 1000).toISOString()
        });

        // ─────────────────────────────────────────────────────────────────
        // Handle COMMENTS (changes where field === 'comments')
        // ─────────────────────────────────────────────────────────────────
        if (entry.changes && entry.changes.length > 0) {
            entry.changes.forEach((change, changeIndex) => {
                console.log(`\n📝 Change ${changeIndex + 1}: field = "${change.field}"`);

                if (change.field === 'comments') {
                    const value = change.value;

                    // Extract the key data points
                    const commentData = {
                        comment_id: value.id,
                        media_id: value.media?.id,
                        text: value.text,
                        from_id: value.from?.id,
                        from_username: value.from?.username
                    };

                    console.log('\n┌────────────────────────────────────────────────────');
                    console.log('│ 💬 NEW COMMENT DETECTED');
                    console.log('├────────────────────────────────────────────────────');
                    console.log('│ Comment ID:', commentData.comment_id);
                    console.log('│ Media ID:  ', commentData.media_id);
                    console.log('│ Text:      ', commentData.text);
                    console.log('│ From ID:   ', commentData.from_id);
                    console.log('│ Username:  ', commentData.from_username);
                    console.log('└────────────────────────────────────────────────────\n');

                    // 🚀 TRIGGER AUTOMATION: Process comment and send DM if keywords match
                    handleNewComment(
                        commentData.comment_id,
                        commentData.from_id,
                        commentData.text,
                        commentData.from_username
                    ).then(result => {
                        console.log('🤖 Automation result:', result);
                    }).catch(error => {
                        console.error('❌ Automation error:', error.message);
                    });

                } else {
                    console.log('   Value:', JSON.stringify(change.value, null, 2));
                }
            });
        }

        // ─────────────────────────────────────────────────────────────────
        // Handle DIRECT MESSAGES
        // ─────────────────────────────────────────────────────────────────
        if (entry.messaging && entry.messaging.length > 0) {
            entry.messaging.forEach((event, msgIndex) => {
                console.log(`\n💬 Message ${msgIndex + 1}:`);

                const messageData = {
                    sender_id: event.sender?.id,
                    recipient_id: event.recipient?.id,
                    timestamp: event.timestamp,
                    message_id: event.message?.mid,
                    message_text: event.message?.text
                };

                console.log('┌────────────────────────────────────────────────────');
                console.log('│ 📩 DIRECT MESSAGE');
                console.log('├────────────────────────────────────────────────────');
                console.log('│ Sender ID:  ', messageData.sender_id);
                console.log('│ Message ID: ', messageData.message_id);
                console.log('│ Text:       ', messageData.message_text);
                console.log('└────────────────────────────────────────────────────\n');

                // TODO: Process this DM
                // - Check for trigger keywords
                // - Send automated reply
            });
        }
    });

    console.log('════════════════════════════════════════════════════════════\n');
});

module.exports = router;
