-- ═══════════════════════════════════════════════════════════════════════════════
-- Instagram Automation SaaS - Database Schema
-- Target: Neon Serverless PostgreSQL
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────────────
-- USERS TABLE
-- Stores the app admin (you) synced with Clerk authentication
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast Clerk ID lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- LEADS TABLE
-- Stores Instagram users who comment on your posts
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instagram_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255),
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast Instagram ID lookups
CREATE INDEX IF NOT EXISTS idx_leads_instagram_id ON leads(instagram_id);
CREATE INDEX IF NOT EXISTS idx_leads_username ON leads(username);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- ─────────────────────────────────────────────────────────────────────────────
-- CONVERSATIONS TABLE
-- Stores comments from leads and bot replies
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('comment', 'reply', 'dm_in', 'dm_out')),
    content TEXT NOT NULL,
    sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'negative', 'neutral', 'question')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_message_type ON conversations(message_type);
CREATE INDEX IF NOT EXISTS idx_conversations_sentiment ON conversations(sentiment);
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp);

-- ─────────────────────────────────────────────────────────────────────────────
-- HELPFUL VIEWS
-- ─────────────────────────────────────────────────────────────────────────────

-- View: Lead conversation summary
CREATE OR REPLACE VIEW lead_conversation_summary AS
SELECT 
    l.id as lead_id,
    l.username,
    l.full_name,
    COUNT(c.id) as total_messages,
    COUNT(CASE WHEN c.message_type = 'comment' THEN 1 END) as comments,
    COUNT(CASE WHEN c.message_type = 'reply' THEN 1 END) as replies,
    MAX(c.timestamp) as last_interaction,
    l.created_at as lead_since
FROM leads l
LEFT JOIN conversations c ON l.id = c.lead_id
GROUP BY l.id, l.username, l.full_name, l.created_at;

-- ═══════════════════════════════════════════════════════════════════════════════
-- Schema created successfully!
-- ═══════════════════════════════════════════════════════════════════════════════
