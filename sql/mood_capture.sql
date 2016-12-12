DROP DATABASE IF EXISTS mood_capture;
CREATE DATABASE mood_capture;

\c mood_capture;

CREATE TABLE moods (
  ID SERIAL PRIMARY KEY,
  mood VARCHAR,
  intensity VARCHAR,
  description VARCHAR,
  log TIMESTAMP
);

INSERT INTO moods (mood, intensity, description, log)
  VALUES ('Happy', '7', 'Today I have been happy all day', now());