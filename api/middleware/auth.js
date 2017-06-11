'use strict';

const bcrypt = require('bcryptjs');
const jwtp = require('../util/jwt');
const crypto = require('crypto');

const SECRET = require('../config').token.secret;
const ENCRYPTPASSWORD = require('../config').token.encryptpassword;
const User = require('../models/user');

function _encryptToken(str) {
    let cipher = crypto.createCipher('aes-256-ctr', ENCRYPTPASSWORD);
    let crypted = cipher.update(str,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

function _decryptToken(str) {
    let decipher = crypto.createDecipher('aes-256-ctr', ENCRYPTPASSWORD);
    try {
        let dec = decipher.update(str, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    } catch (error) {
        throw { message: 'Check token. Bad input string' };
    }

}

module.exports.makeToken = function () {
    return function (req, res) {
        User.GetByEmail(req.body.email)
            .then(function (user) {

                let accessTokenConfig = {
                    payload: {
                        username: user.name,
                        userRole: user.role
                    },

                    options: {
                        algorithm: 'HS512',
                        expiresIn: '15m',
                        subject: user.id.toString()
                    }
                };

                let refreshTokenConfig = {
                    options: {
                        algorithm: 'HS512',
                        expiresIn: '60m', // '60d'
                        subject: user.id.toString()
                    }
                };

                let accessTokenResult;

                jwtp.sign(accessTokenConfig.payload, SECRET, accessTokenConfig.options)
                    .then(accessToken => {
                        return accessToken;
                    })
                    .then((accessToken) => {
                        accessTokenResult = accessToken;
                        return jwtp.sign({}, SECRET, refreshTokenConfig.options);
                    })
                    .then(refreshToken => {
                        res.json({
                            success: true,
                            accessToken: _encryptToken(accessTokenResult),
                            refreshToken
                        });
                    })
                    .catch(error => {
                        res.status(400).json({ success: false, description: error });
                    });
            })
            .catch(function (error) {
                res.status(404).send({ success: false, description: error });
            });
    };
};

/**
 * ------------------------------
 * description: checks token from client request
 * ------------------------------
 * if token is valid define help object 'helpData' with current 'userId', 'userRole' fields
 * and pass to next middleware
 *
 * if token is missing >> set 'helpData' object 'userId', 'userRole' fields to false
 * and pass to next middleware
 */
module.exports.checkToken = function () {
    return function (req, res, next) {
        let token = req.body.token || req.headers['token'];

        if (token) {
            token = _decryptToken(token);

            jwtp.verify(token, SECRET)
                .then(decoded => {
                    req.body.helpData = {
                        userId: decoded.sub,
                        userRole: decoded.userRole
                    };
                    return next();
                })
                .catch(error => {
                    req.body.helpData = {
                        userId: false,
                        userRole: false
                    };
                    return next();
                });

        } else {
            req.body.helpData = {
                userId: false,
                userRole: false
            };
            return next();
        }
    };
};

module.exports.signOut = function () {
    return function (req, res) {
        res.json({ success: true, description: 'User sign out system' });
    };
};

/**
 * ------------------------------
 * description: help middleware
 * ------------------------------
 * makes hash for password at User creation
 */
module.exports.hashPassword = function () {
    return function(req, res, next) {
        if (req.body.password) {
            bcrypt.genSalt(10, function (error, salt) {
                bcrypt.hash(req.body.password, salt, function (error, hash) {
                    if (error) return res.status(400).json({ success: false, description: error });
                    req.body.password_hash = hash; // 'password_hash' transfers and saves to DB
                    delete req.body.password;
                    next();
                });
            });
        }
        else {
            res.status(400).json({success: false, description: '\'password\' field not found'});
        }
    };
};

module.exports.checkPassword = function () {
    return function (req, res, next) {
        User.GetByEmail(req.body.email)
            .then(function (user) {
                bcrypt.compare(req.body.password, user.password_hash, function(error, result) {
                    if (result) return next();
                    res.status(403).json({ success: false, description: 'Invalid password' });
                });
            })
            .catch(function (error) {
                res.status(404).send({ success: false, description: error });
            });
    };
};
