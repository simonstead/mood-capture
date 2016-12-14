const promise = require('bluebird');
const options = {
  // Initialization Options
  promiseLib: promise
};
const pgp = require('pg-promise')(options);
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/mood_capture';
const db = pgp(connectionString);

module.exports = db;
