-- Create leaderboard table for Arrow Reflex game
CREATE TABLE IF NOT EXISTS leaderboard (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  handle TEXT NOT NULL,
  arrows INTEGER NOT NULL,
  time INTEGER NOT NULL,
  twitter_profile_image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_arrows_time ON leaderboard(arrows DESC, time ASC);

-- Add comment
COMMENT ON TABLE leaderboard IS 'Stores Arrow Reflex game scores and leaderboard entries';
