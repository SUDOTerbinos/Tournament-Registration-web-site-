-- Database schema for eFootball Tournament Registration
-- Compatible with Vercel Postgres

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  telegram VARCHAR(255) NOT NULL,
  transaction_id VARCHAR(255) NOT NULL,
  screenshot_name VARCHAR(255),
  screenshot_data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Winner table
CREATE TABLE IF NOT EXISTS winner (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  prize VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL,
  achievements JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Countdown table
CREATE TABLE IF NOT EXISTS countdown (
  id SERIAL PRIMARY KEY,
  start_time TIMESTAMP NOT NULL,
  duration_days INTEGER NOT NULL,
  duration_hours INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_players_phone ON players(phone);
CREATE INDEX IF NOT EXISTS idx_players_created_at ON players(created_at);
CREATE INDEX IF NOT EXISTS idx_winner_created_at ON winner(created_at);
CREATE INDEX IF NOT EXISTS idx_countdown_created_at ON countdown(created_at);

-- Trigger to update updated_at timestamp for players
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_players_updated_at 
    BEFORE UPDATE ON players 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
