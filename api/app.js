'use strict';

require('dotenv').config();

const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
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

// use static/public folder
app.use(express.static(path.join(__dirname, 'public')));

// enable CORS only for local client
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', config.client.host + ':' + config.client.port);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

//routers init
app.use(controllers);

//catch 'No route found' Error
app.use(function (req, res, next) {
    res.status(404).json({ success: false, error: '404, No route found' });
});

// development error handler
if (app.get('env') === 'development') {
    app.use(function (error, req, res, next) {
        if (error.stack) {
            global.console.log('error.stack >>');
            global.console.log(error.stack);
        }

        res.status( error.status || (error.isJoi ? 400 : 500) ).json({
            success: false,
            description: error,
            env: 'development/regular',
            handled_in: 'app.js'
        });
    });
}

// production uncaughtException error handler // todo >> send email if error
process.on('uncaughtException', function(error) {
    global.console.error((new Date).toUTCString() + ' uncaughtException:', error.message);
    global.console.log('error.stack >>');
    global.console.error(error.stack);
    process.exit(1);
});

// production error handler // todo >> send email if error
app.use(function (error, req, res, next) {
    res.status(error.status || 500).json({
        success: false,
        description: error.message || error,
        env: 'production/regular',
        handled_in: 'app.js'
    });
});

module.exports = app;
