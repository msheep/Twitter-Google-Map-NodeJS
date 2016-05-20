var compression = require('compression')
var express = require('express');
var serveStatic = require('serve-static')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var maps = require('./routes/maps');
var group = require('./routes/group');
var politics = require('./routes/politics');
var footy = require('./routes/footy');
var expressLayouts = require('express-ejs-layouts');

var app = express();
app.use(compression());

var expires = new Date();
expires.setTime(expires.getTime() + 60 * 60 * 24 * 365);
app.use(serveStatic(path.join(__dirname, '/public'), {
  maxAge: 60 * 60 * 24 * 365,
  setHeaders: function(res, path) {
      res.setHeader("Expires", expires.toUTCString());
      res.setHeader("Cache-Control", "max-age=" + 60 * 60 * 24 * 365);
  }
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
// use ejs-locals for all ejs templates:
app.set('layout', 'layout');

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressLayouts);

app.use('/', routes);
app.use('/maps', maps);
app.use('/group', group);
app.use('/politics', politics);
app.use('/footy', footy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;
