
DROP TABLE IF EXISTS answer_attempts CASCADE;
CREATE TABLE answer_attempts (
  id SERIAL PRIMARY KEY NOT NULL,
  answer_id INTEGER REFERENCES answers(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quiz_attempt_id INTEGER REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE
);
