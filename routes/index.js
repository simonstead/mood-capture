var express = require('express');
var router = express.Router();
var store = require('../models/store');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Add New Mood' });
});

/* GET log page. */
router.get('/viewAll', store.getAllMoods);

/* POST add new mood */
router.post('/addNewMood', store.addNewMood);

router.get('/deleteMood/:id', store.deleteMood);

module.exports = router;
