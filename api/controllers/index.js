'use strict';

var express = require('express');
var router = express.Router();

var userCtrl = require('./userCtrl');
var postCtrl = require('./postCtrl');
var authCtrl = require('./authCtrl');

router.use('/',     index());
router.use('/user', userCtrl);
router.use('/post', postCtrl);
router.use('/auth', authCtrl);

function index () {
    return function (req, res) {
        res.end();
    }
}

module.exports = router;
