'use strict';

var express = require('express'),
    router = express.Router();

var rootCtrl = require('./rootCtrl'),
    userCtrl = require('./userCtrl'),
    postCtrl = require('./postCtrl');

router.use('/',     rootCtrl);
router.use('/user', userCtrl);
router.use('/post', postCtrl);

module.exports = router;
