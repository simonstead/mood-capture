-- DROP DATABASE IF EXISTS mood_capture;
-- CREATE DATABASE mood_capture;

-- \c mood_capture;


-- CREATE TABLE IF NOT EXISTS moods (
--   ID SERIAL PRIMARY KEY,
--   mood VARCHAR,
--   intensity VARCHAR,
--   description VARCHAR,
--   log TIMESTAMP,
--   username VARCHAR
-- );

ALTER TABLE moods
  ADD COLUMN username VARCHAR;

CREATE TABLE IF NOT EXISTS users (
  ID SERIAL PRIMARY KEY,
  username VARCHAR,
  password VARCHAR,
  salt VARCHAR
);

-- CREATE TABLE IF NOT EXISTS "session" (
--   "sid" varchar NOT NULL COLLATE "default",
--   "sess" json NOT NULL,
--   "expire" timestamp(6) NOT NULL
-- )
-- WITH (OIDS=FALSE);
--
-- ALTER TABLE "session" ADD CONSTRAINT "session_pkey"
-- PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
