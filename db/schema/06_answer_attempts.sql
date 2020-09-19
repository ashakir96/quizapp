-- Drop and recreate Widgets table (Example)

DROP TABLE IF EXISTS answer_attempts CASCADE;
CREATE TABLE answer_attempts (
  id SERIAL PRIMARY KEY NOT NULL,
  answer_id INTEGER REFERENCES answers(id) ON DELETE CASCADE,
  attempt_id INTEGER REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  result INTEGER NOT NULL DEFAULT 0
);
