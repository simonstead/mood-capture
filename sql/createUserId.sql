-- CREATE TABLE users (
--   ID SERIAL PRIMARY KEY,
--   username VARCHAR,
--   password VARCHAR,
--   salt VARCHAR
-- );

ALTER TABLE users
  ADD COLUMN
    salt VARCHAR;
