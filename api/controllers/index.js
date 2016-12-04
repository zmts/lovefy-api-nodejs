'use strict';

var express = require('express');
var router = express.Router();

var rootCtrl = require('./rootCtrl');
var userCtrl = require('./userCtrl');
var postCtrl = require('./postCtrl');
var authCtrl = require('./authCtrl');

router.use('/',     rootCtrl);
router.use('/user', userCtrl);
router.use('/post', postCtrl);
router.use('/auth', authCtrl);

module.exports = router;
