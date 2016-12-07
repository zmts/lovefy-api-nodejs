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

router.get('/help', help());

/**
 * @api public
 * ------------------------------
 * description: help
 * ------------------------------
 * url: user/help
 * method: GET
 */
function help () {
    return function(req, res) {
        // var str = fs.readFileSync(__filename, 'utf8');
        res.send('User route help info');
    }
}

module.exports = router;
