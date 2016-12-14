const db = require('./db');



const passport = require('passport');
const bcrypt = require('bcrypt');




const signup = (req, res) => {
  var username = req.body.username
  var password = req.body.password
  var password2 = req.body.password2
  console.log(username, password, password2);

  if (!username || !password || !password2) {
    req.flash('error', "Please, fill in all the fields.")
    res.redirect('signup')
  }

  if (password !== password2) {
    res.render('signup', { error: "Please, enter the same password twice."})
  }

  var salt = bcrypt.genSaltSync(10)
  var hashedPassword = bcrypt.hashSync(password, salt)

  var newUser = {
    username: username,
    salt: salt,
    password: hashedPassword
  }

  db.none("INSERT INTO users (username,password, salt) VALUES (${username}, ${password}, ${salt})", newUser)
  .then(function(user) {
    db.any(`select * from moods WHERE username = '${username}'`, user)
      .then((data) => res.render('log', { title: 'View All Moods', data: data, user: user}))
      .catch((err) => next(err))
  }).catch(function(error) {
    res.render('signup', {
      error: error
    })
  })
}

module.exports = {
  signup: signup
}
