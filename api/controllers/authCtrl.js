'use strict';

/**
 * ------------------------------
 * All handlers related to authentication
 * located in 'middleware/auth' module
 * ------------------------------
 */

var express = require('express');
var router = express.Router();

var auth = require('../middleware/auth');

/**
 * ------------------------------
 * description: User sign in(login) system
 * ------------------------------
 * url: auth/signin
 * method: POST
 * request: {"email": "string", password: "string"}
 */
router.post('/signin', auth.checkEmailAvailability(), auth.checkPassword(), auth.makeToken());

/**
 * ------------------------------
 * description: User sign out(logout) system
 * ------------------------------
 * url: auth/signout
 * method: POST
 * request: {"email": "string"}
 */
router.post('/signout', auth.signOut());

module.exports = router;
