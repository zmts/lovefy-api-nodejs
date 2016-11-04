'use strict';

var express = require('express'),
    router = express.Router();

var rootCtrl = require('./rootCtrl'),
    userCtrl = require('./userCtrl');

router.use('/',     rootCtrl);
router.use('/user', userCtrl);

module.exports = router;
