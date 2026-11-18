-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  photo TEXT NOT NULL,
  bio TEXT NOT NULL,
  city TEXT NOT NULL,
  college TEXT,
  interests TEXT NOT NULL
);

-- Swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id TEXT PRIMARY KEY,
  from_user_id TEXT NOT NULL,
  to_profile_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('LIKE', 'PASS')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(from_user_id, to_profile_id)
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, profile_id)
);

-- Private incoming likes table (never exposed to public APIs)
CREATE TABLE IF NOT EXISTS incoming_likes (
  id TEXT PRIMARY KEY,
  from_profile_id TEXT NOT NULL,
  to_user_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(from_profile_id, to_user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_swipes_from_user ON swipes(from_user_id);
CREATE INDEX IF NOT EXISTS idx_swipes_to_profile ON swipes(to_profile_id);
CREATE INDEX IF NOT EXISTS idx_matches_user ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_incoming_likes_to_user ON incoming_likes(to_user_id);
