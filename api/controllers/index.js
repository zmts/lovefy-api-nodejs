'use strict';

var express = require('express');
var router = express.Router();

var userCtrl = require('./userCtrl');
var postCtrl = require('./postCtrl');
var authCtrl = require('./authCtrl');

router.get('/', function (req, res) {
    res.json({success: true, data: 'hello'});
});

router.use('/user', userCtrl);
router.use('/post', postCtrl);
router.use('/auth', authCtrl);

module.exports = router;
