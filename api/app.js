'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config');

const controllers = require('./controllers');

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'templates'));

// use static/public folder
app.use(express.static(path.join(__dirname, 'public')));

// enable CORS only for local client
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", config.client.host + ':' + config.client.port);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//routers init
app.use(controllers);
//catch 404 and forward to error handler
app.use(function(req, res) {
    res.status(404).json({success: false, error: '404, No route found'});
});

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
