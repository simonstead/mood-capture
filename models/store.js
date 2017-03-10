const db = require('./db');



const passport = require('passport');
const bcrypt = require('bcrypt');




const signup = (req, res) => {
  const body = req.body
  var username = body.username
  var password = body.password
  var password2 = body.password2

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

  // TODO: check for duplicate usernames!
  //
  // db.none("INSERT INTO users (username,password, salt) VALUES (${username}, ${password}, ${salt})", newUser)
  // .then(function(user) {
  //   db.any(`select * from moods WHERE username = '${username}'`, user)
  //     .then((data) => res.render('log', { title: 'View All Moods', data: data, user: user}))
  //     .catch((err) => next(err))
  // }).catch(function(error) {
  //   res.render('signup', {
  //     error: error
  //   })
  // })

  db.any("SELECT * FROM users WHERE username = $1", [username]).then(
    (user) => {
      console.log(user, user.length);
      if (user.length !== 0) {
        res.render('signup', {
          validationErrors: "Sorry, that username is already taken.",
          form: body
        })
      }
      else {
        Promise.all([
          db.one("INSERT INTO users (username, password, salt) VALUES (${username}, ${password}, ${salt}) RETURNING *", newUser),
          db.any(`select * from moods WHERE username = '${username}'`, user)
        ])
        .then(function(data) {
          req.login(data[0], () =>
            res.render('log', {
                title: 'View All Moods',
                user: data[0],
                data: data[1],
                confirmation: "Thank you for signing up."
            })
          )
        })
        .catch(function(error) {
          res.render('signup', {
            error: error,
            form: body
          })
        })
      }
    }
  )


}

module.exports = {
  signup: signup
}
