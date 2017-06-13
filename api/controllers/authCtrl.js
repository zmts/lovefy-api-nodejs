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
 * description: User sign out(logout) system
 * url: auth/signout
 * request: {"id": "user_id"}
 */
router.post('/signout/:id', auth.checkToken(), sec.checkOwnerIdInParams(), auth.signOut());

/**
 * @description: User sign in(login) system
 * @url: auth/refresh-token
 * @headers: 'refreshToken'
 */
router.post('/refresh-token', auth.refreshTokens());

module.exports = router;
