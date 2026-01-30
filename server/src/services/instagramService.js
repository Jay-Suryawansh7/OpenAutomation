const axios = require('axios');

// ═══════════════════════════════════════════════════════════════════════════════
// Instagram Automation Service
// Handles comment processing and automated replies
// ═══════════════════════════════════════════════════════════════════════════════

const GRAPH_API_VERSION = 'v19.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// ─────────────────────────────────────────────────────────────────────────────
// Trigger Keywords Configuration
// ─────────────────────────────────────────────────────────────────────────────
const TRIGGER_KEYWORDS = [
    'link',
    'guide',
    'me',
    'send',
    'want',
    'please',
    'info',
    'how',
    'interested',
    'dm',
    'details'
];

// Default message template
const DEFAULT_DM_MESSAGE = `Hey! 👋 Thanks for your interest!

Here's the link you requested: [YOUR_LINK_HERE]

Let me know if you have any questions! 🚀`;

// ─────────────────────────────────────────────────────────────────────────────
// Check if comment contains trigger keywords
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Check if the comment text contains any trigger keywords
 * @param {string} text - The comment text
 * @returns {object} - { shouldReply: boolean, matchedKeywords: string[] }
 */
const checkTriggerKeywords = (text) => {
    if (!text) return { shouldReply: false, matchedKeywords: [] };

    const lowerText = text.toLowerCase();
    const matchedKeywords = TRIGGER_KEYWORDS.filter(keyword =>
        lowerText.includes(keyword.toLowerCase())
    );

    return {
        shouldReply: matchedKeywords.length > 0,
        matchedKeywords
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// Handle New Comment
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Process a new comment and determine if we should send a DM reply
 * @param {string} commentId - The Instagram comment ID
 * @param {string} userId - The Instagram User ID of the commenter
 * @param {string} text - The comment text
 * @param {string} username - The username of the commenter (optional)
 * @returns {Promise<object>} - Result of the operation
 */
const handleNewComment = async (commentId, userId, text, username = null) => {
    console.log('\n🤖 Processing comment for automation...');
    console.log('   Comment ID:', commentId);
    console.log('   User ID:', userId);
    console.log('   Username:', username);
    console.log('   Text:', text);

    // Check for trigger keywords
    const { shouldReply, matchedKeywords } = checkTriggerKeywords(text);

    if (!shouldReply) {
        console.log('   ❌ No trigger keywords found. Skipping.');
        return {
            success: true,
            action: 'skipped',
            reason: 'No matching keywords',
            commentId,
            userId
        };
    }

    console.log('   ✅ Trigger keywords found:', matchedKeywords.join(', '));

    // Generate personalized message
    const message = username
        ? `Hey @${username}! 👋 Thanks for your interest!\n\nHere's the link you requested: [YOUR_LINK_HERE]\n\nLet me know if you have any questions! 🚀`
        : DEFAULT_DM_MESSAGE;

    // Send private reply
    try {
        const result = await sendPrivateReply(commentId, message);

        console.log('   ✅ Private reply sent successfully!');

        return {
            success: true,
            action: 'replied',
            matchedKeywords,
            commentId,
            userId,
            messageId: result.message_id
        };
    } catch (error) {
        console.error('   ❌ Failed to send private reply:', error.message);

        return {
            success: false,
            action: 'failed',
            error: error.message,
            commentId,
            userId
        };
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Send Private Reply (DM) to Comment
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Send a private DM reply to a user who commented
 * Uses Instagram Graph API private_replies endpoint
 * 
 * @param {string} commentId - The comment ID to reply to
 * @param {string} messageText - The message to send
 * @returns {Promise<object>} - API response
 */
const sendPrivateReply = async (commentId, messageText) => {
    const accessToken = process.env.IG_ACCESS_TOKEN;

    if (!accessToken) {
        throw new Error('IG_ACCESS_TOKEN is not configured');
    }

    const url = `${GRAPH_API_BASE}/${commentId}/private_replies`;

    console.log('\n📤 Sending private reply...');
    console.log('   URL:', url);
    console.log('   Message:', messageText.substring(0, 50) + '...');

    try {
        const response = await axios.post(
            url,
            { message: messageText },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('   ✅ API Response:', response.data);
        return response.data;

    } catch (error) {
        // Extract meaningful error from Instagram API response
        const apiError = error.response?.data?.error;

        if (apiError) {
            console.error('   ❌ Instagram API Error:', {
                message: apiError.message,
                type: apiError.type,
                code: apiError.code,
                subcode: apiError.error_subcode
            });
            throw new Error(`Instagram API: ${apiError.message}`);
        }

        throw error;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Reply to Comment (Public)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Post a public reply to a comment
 * @param {string} commentId - The comment ID to reply to
 * @param {string} replyText - The reply text
 * @returns {Promise<object>} - API response
 */
const replyToComment = async (commentId, replyText) => {
    const accessToken = process.env.IG_ACCESS_TOKEN;

    if (!accessToken) {
        throw new Error('IG_ACCESS_TOKEN is not configured');
    }

    const url = `${GRAPH_API_BASE}/${commentId}/replies`;

    console.log('\n📤 Posting public reply to comment...');
    console.log('   URL:', url);

    try {
        const response = await axios.post(
            url,
            { message: replyText },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('   ✅ Comment reply posted:', response.data);
        return response.data;

    } catch (error) {
        const apiError = error.response?.data?.error;

        if (apiError) {
            console.error('   ❌ Instagram API Error:', apiError);
            throw new Error(`Instagram API: ${apiError.message}`);
        }

        throw error;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Send Direct Message
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Send a direct message to an Instagram user
 * @param {string} recipientId - The Instagram User ID to message
 * @param {string} messageText - The message to send
 * @returns {Promise<object>} - API response
 */
const sendDirectMessage = async (recipientId, messageText) => {
    const accessToken = process.env.IG_ACCESS_TOKEN;

    if (!accessToken) {
        throw new Error('IG_ACCESS_TOKEN is not configured');
    }

    const url = `${GRAPH_API_BASE}/me/messages`;

    console.log('\n📤 Sending direct message...');
    console.log('   Recipient ID:', recipientId);

    try {
        const response = await axios.post(
            url,
            {
                recipient: { id: recipientId },
                message: { text: messageText }
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('   ✅ DM sent:', response.data);
        return response.data;

    } catch (error) {
        const apiError = error.response?.data?.error;

        if (apiError) {
            console.error('   ❌ Instagram API Error:', apiError);
            throw new Error(`Instagram API: ${apiError.message}`);
        }

        throw error;
    }
};

module.exports = {
    handleNewComment,
    sendPrivateReply,
    replyToComment,
    sendDirectMessage,
    checkTriggerKeywords,
    TRIGGER_KEYWORDS
};
