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
  db.any(`select * from moods WHERE username = '${req.user.username}'`)
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
  db.none(`
    insert into moods (mood, intensity, description, log, username)
    values('${req.body.mood}', '${req.body.intensity}', '${req.body.description}',
    now(), '${req.user.username}')`)
  .then(() => res.redirect('/viewAll'))
  .catch((err) => next(err))
}
router.post('/addNewMood', ensureAuthenticated, addNewMood)


const deleteMood = (req, res, next) => {
  db.any(`DELETE FROM moods WHERE moods.id = ${req.params.id}`)
  .then(() => res.redirect('/viewAll'))
  .catch((err) => next(err))
}
router.get('/deleteMood/:id', deleteMood)


router.get('/login', (req,res) => res.render('login', {title: "Login", user: req.user }))
router.post('/login', passport.authenticate('local', { successRedirect: 'viewAll', failureRedirect: '/' }))

router.get('/logout', (req, res) => { req.logout(); res.redirect('/') })

router.get('/signup', (req,res) => res.render('signup'))
router.post('/signup', store.signup)


module.exports = router;
