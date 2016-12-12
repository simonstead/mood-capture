const promise = require('bluebird');
const options = {
  // Initialization Options
  promiseLib: promise
};
const pgp = require('pg-promise')(options);
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/mood_capture';
const db = pgp(connectionString);

const addNewMood = (req,res,next) => {
  let mood = req.body
  mood["timestamp"] = new Date()
  db.none('insert into moods (mood, intensity, description, log)' +
      'values(${mood}, ${intensity}, ${description}, ${timestamp})', mood)
  .then(getAllMoods(req,res,next))
  .catch((err) => next(err))
}

const getAllMoods = (req, res, next) => {
  db.any('select * from moods')
  .then((data) => res.render('log', { title: 'View All Moods', data: data}))
  .catch((err) => next(err))
}

const deleteMood = (req, res, next) => {
  db.any('DELETE FROM moods WHERE moods.id = ${id}; select * from moods', req.params)
  .then((data) => res.render('log', { title: 'View All Moods', data: data}))
  .catch((err) => next(err))
}

module.exports = {
  addNewMood: addNewMood,
  getAllMoods: getAllMoods,
  deleteMood: deleteMood
}
