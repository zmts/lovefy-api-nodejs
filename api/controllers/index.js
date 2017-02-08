'use strict';

var express = require('express');
var router = express.Router();

var userCtrl = require('./userCtrl');
var postCtrl = require('./postCtrl');
var authCtrl = require('./authCtrl');

router.get('/', function (req, res) {
    res.json({success: true, data: 'hello'});
});

router.use('/users', userCtrl);
router.use('/posts', postCtrl);
router.use('/auth', authCtrl);

module.exports = router;
