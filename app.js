var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//env - mongo atlas userdata
const dotenv = require("dotenv");
dotenv.config();

var app = express();

//session
var session = require('express-session');
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

//passport
const passport = require("passport");
const { loginCheck } = require("./auth/passport");
loginCheck(passport);

app.use(passport.initialize());
app.use(passport.session());

// Mongo DB conncetion
const mongoose = require('mongoose');
const database = process.env.MONGOLAB_URI;
mongoose.connect(database, {useUnifiedTopology: true, useNewUrlParser: true })
.then(() => console.log('Mongo connected!'))
.catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
var indexRouter = require('./routes/index');
var listRouter = require('./routes/listRoutes');
var userRouter = require('./routes/userRoutes');

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/list', listRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
