CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_scores_difficulty ON scores(difficulty, score DESC, created_at);
