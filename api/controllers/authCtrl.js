'use strict';

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
 * @description: sign out(logout) User by TUID
 * @headers: token
 */
router.post('/signout', auth.checkToken(), sec.isLoggedIn(), auth.signOut());

/**
 * @url: auth/refresh-tokens
 * @request: {"refreshToken": "string"}
 */
router.post('/refresh-tokens', auth.refreshTokens());

module.exports = router;
