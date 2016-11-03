'use strict';

var express = require('express'),
    router = express.Router();

router.use('/',     require('./rootCtrl'));
router.use('/user', require('./userCtrl'));

module.exports = router;
