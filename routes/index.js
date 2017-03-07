var express = require('express');
var router = express.Router();
var store = require('../models/store');
const passport = require('passport');
const db = require('../models/db');

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/');
  }
}


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Add New Mood', user: req.user});
});

/* GET log page. */
router.get('/viewAll', ensureAuthenticated, (req, res, next) => {
  db.any('select * from moods WHERE username = ${username}', req.user)
    .then((data) => {
      if (data) {
        res.render('log', { title: 'View All Moods', user: req.user, data: data})
      }
      else {
        next(err);
      }
    })
    .catch((err) => next(err))
});

/* POST add new mood */
const addNewMood = (req,res,next) => {
  const query = 'insert into moods (mood, intensity, description, log, username, situation, thoughts, emotions, physical, actions, memes)' +
    'values(${mood}, ${intensity}, ${description}, now(), ${username}, ${situation}, ${thoughts}, ${emotions}, ${physical}, ${actions}, ${memes})';
  const mood = {
    mood: req.body.mood,
    intensity: req.body.intensity,
    description: req.body.description,
    username: req.user.username,
    situation: req.body.situation,
    thoughts: req.body.thoughts,
    emotions: req.body.emotions,
    physical: req.body.physical,
    actions: req.body.actions,
    memes: req.body.memes
  }
  db.none(query, mood)
  .then(() => res.redirect('/viewAll'))
  .catch((err) => next(err))
}
router.post('/addNewMood', ensureAuthenticated, addNewMood)


const deleteMood = (req, res, next) => {
  db.any('DELETE FROM moods WHERE moods.id = ${id}', req.params)
  .then(() => res.redirect('/viewAll'))
  .catch((err) => next(err))
}
router.get('/deleteMood/:id', ensureAuthenticated, deleteMood)


const updateMood = (req, res, next) => {
  const params = {
    mood: req.body.mood,
    intensity: req.body.intensity,
    description: req.body.description,
    id: req.params.id,
    username: req.user.username,
    situation: req.body.situation,
    thoughts: req.body.thoughts,
    emotions: req.body.emotions,
    physical: req.body.physical,
    actions: req.body.actions,
    memes: req.body.memes
  }
  const sql = 'UPDATE moods SET mood = ${mood}, intensity = ${intensity}, description = ${description}, situation = ${situation}, '
  + 'thoughts = ${thoughts}, emotions = ${emotions}, physical = ${physical}, actions = ${actions}, memes = ${memes}'
  + ' WHERE id = ${id} AND username = ${username}';
  db.any(sql, params)
  .then(() => res.redirect('/viewAll'))
  .catch((err) => next(err))
}
router.post('/updateMood/:id', ensureAuthenticated, updateMood)

router.get('/updateMood/:id', ensureAuthenticated,
  function (req, res, next) {
    db.one('SELECT * FROM moods WHERE moods.id = ${id}', req.params)
    .then((mood) => res.render('update', {
          title: "Update Mood",
          mood: mood,
          user: req.user
        }))
    .catch((err) => next(err))
  }
)

router.get('/login', (req,res) => res.render('login', {title: "Login", user: req.user }))
router.post('/login', passport.authenticate('local', { successRedirect: 'viewAll', failureRedirect: '/' }))

router.get('/logout', (req, res) => { req.logout(); res.redirect('/') })

router.get('/signup', (req,res) => res.render('signup'))
router.post('/signup', store.signup)


module.exports = router;
