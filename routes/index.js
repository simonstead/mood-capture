var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Add New Mood' });
});

/* GET log page. */
router.get('/viewAll', function(req, res, next) {
  res.render('log', { title: 'View All Moods'});
});

/* POST add new mood */
router.POST('/addNewMood', function(req, res, next) {
  console.log(res.body);
  res.render('index', { title: 'New mood added' });
})

module.exports = router;
