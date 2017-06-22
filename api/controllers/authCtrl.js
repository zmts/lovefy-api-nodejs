'use strict';

/**
 * ------------------------------
 * All handlers related to authentication
 * located in 'middleware/auth' module
 * ------------------------------
 */

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const sec = require('../middleware/security');


/**
 * @description: User sign in(login) system
 * @url: auth/signin
 * @request: {"email": "string", password: "string"}
 */
router.post('/signin', auth.checkPassword(), auth.makeTokens());

/**
 * @description: User sign out(logout) system by TUID
 * @headers: token
 */
router.post('/signout', auth.checkToken(), sec.isLoggedIn(), auth.signOut());

/**
 * @description: User sign in(login) system
 * @url: auth/refresh-token
 * @headers: 'refreshToken'
 */
router.post('/refresh-tokens', auth.refreshTokens());

module.exports = router;
