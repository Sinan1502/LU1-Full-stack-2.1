var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var verifyJWT = require('./src/middleware/verifyJWT');
var cors = require('cors');

var indexRouter = require('./src/routes/index.route');
var usersRouter = require('./src/routes/users.route');
var registerRouter = require('./src/routes/register.route');
var authRouter = require('./src/routes/auth.route');
var refreshRouter = require('./src/routes/refresh.route');
var logoutRouter = require('./src/routes/logout.route');
var dashboardRouter = require('./src/routes/dashboard.route');


var app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/refresh', refreshRouter);
app.use('/logout', logoutRouter);
app.use('/dashboard', dashboardRouter);
app.use('/users', usersRouter);

app.use(verifyJWT);

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
