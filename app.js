var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var db = require('./models/db');
var passport = require('passport');
const initPassport = require('./auth/local');

var bcrypt = require('bcrypt');
var flash = require('connect-flash');




var pg = require('pg')
  , session = require('express-session')
  , pgSession = require('connect-pg-simple')(session);



var index = require('./routes/index');
var users = require('./routes/users');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/bower_components/", express.static(path.join(__dirname, 'bower_components')));


//init passport
const LocalStrategy = require('passport-local').Strategy;
const authHelpers = require('./auth/_helpers.js');
const options = {
  usernameField: 'username',
  passwordField: 'password'
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.one(`SELECT * FROM users WHERE id = ${id}`)
  .then((user) => { done(null, user); })
  .catch((err) => { done(err, null); });
});

passport.use(new LocalStrategy(options, (username, password, done) => {
  // check to see if the username exists
  db.any(`SELECT * FROM users WHERE username = '${username}'`)
  .then((users) => {
    if (users.length !== 1) return done(null, false);
    if (!authHelpers.comparePass(password, users[0].password)) {
      return done(null, false);
    } else {
      return done(null, users[0]);
    }
  })
  .catch((err) => { return done(err); });
}));


// Passport session storage
app.use(session({
  store: new pgSession({
    pg : pg,
    conString : process.env.DATABASE_URL || "postgres://localhost:5432/mood_capture"
  }),
  secret: process.env.PG_COOKIE_SECRET || "asdsg43$$$__SDF",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

//flash messages
app.use(flash());

//initialize passport
app.use(passport.initialize());
app.use(passport.session());


// routes
app.use('/', index);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
