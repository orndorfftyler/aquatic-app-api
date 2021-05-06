CREATE TABLE answers (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  answer_id UUID NOT NULL,
  question_id UUID NOT NULL,
  title TEXT,
  contents TEXT,
  user_id INTEGER REFERENCES users(id)
);



