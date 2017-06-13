'use strict';

const bcrypt = require('bcryptjs');
const jwtp = require('../util/jwt');
const crypto = require('crypto');

const SECRET = require('../config').tokenSecret;
const ENCRYPTPASSWORD = require('../config').tokenSecret.encryptpassword;
const User = require('../models/user');

/**
 * ------------------------------
 * @HELPERS
 * ------------------------------
 */

function _encryptToken(str) {
    let cipher = crypto.createCipher('aes-256-ctr', ENCRYPTPASSWORD);
    try {
        let crypted = cipher.update(str,'utf8','hex');
        crypted += cipher.final('hex');
        return crypted;
    } catch (error) {
        throw { message: 'Bad encryption input string' };
    }

}

function _decryptToken(str) {
    let decipher = crypto.createDecipher('aes-256-ctr', ENCRYPTPASSWORD);
    try {
        let dec = decipher.update(str, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    } catch (error) {
        throw { message: 'Bad decryption input string' };
    }

}

/**
 * @description make access token
 * @return Promise
 */

function _makeAccessToken(userModel){
    let accessTokenConfig = {
        payload: {
            accessToken: true,
            username: userModel.name,
            userRole: userModel.role
        },

        options: {
            algorithm: 'HS512',
            expiresIn: '15m',
            subject: userModel.id.toString()
        }

    };

    return jwtp.sign(accessTokenConfig.payload, SECRET.access, accessTokenConfig.options);
}

/**
 * @description make refresh token
 * @return Promise
 */
function _makeRefreshToken(){
    let refreshTokenConfig = {
        payload: {
            refreshToken: true
        },

        options: {
            algorithm: 'HS512',
            expiresIn: '60m', // '60d'
        }
    };

    return jwtp.sign(refreshTokenConfig.payload, SECRET.refresh, refreshTokenConfig.options);
}

/**
 * ------------------------------
 * @MIDDLEWARE
 * ------------------------------
 */

module.exports.makeTokens = () => {
    return (req, res, next) => {
        User.GetByEmail(req.body.email)
            .then(user => {

                let accessTokenResult;
                _makeAccessToken(user)
                    .then(accessToken => {
                        accessTokenResult = accessToken;
                    })
                    .then(() => {
                        return _makeRefreshToken();
                    })
                    .tap(refreshToken => {
                        return User.UPDATE(user.id, { refresh_token: _encryptToken(refreshToken) });
                    })
                    .then(refreshToken => {
                        res.json({
                            success: true,
                            accessToken: _encryptToken(accessTokenResult),
                            refreshToken: _encryptToken(refreshToken)
                        });
                    }).catch(error => {
                        res.status(400).json({ success: false, description: error });
                    });
            }).catch(error => next(error));
    };
};

module.exports.refreshTokens = () => {
    return (req, res, next) => {
        let refreshToken = req.body.refreshToken || req.headers['refreshToken'];

        if (refreshToken) {
            let decryptedRefreshToken = _decryptToken(refreshToken);

            User.GetByEmail(req.body.email)
                .then(user => {
                    if (user.refresh_token === refreshToken) {

                        let resultRefreshToken;
                        jwtp.verify(decryptedRefreshToken, SECRET.refresh)
                            .then(() => {
                                return _makeRefreshToken();
                            })
                            .tap(newRefreshToken => {
                                resultRefreshToken = newRefreshToken;
                                return User.UPDATE(user.id, { refresh_token: _encryptToken(newRefreshToken) });
                            })
                            .then(() => {
                                return _makeAccessToken(user);
                            })
                            .then(newAccessToken => {
                                return res.json({
                                    success: true,
                                    accessToken: _encryptToken(newAccessToken),
                                    refreshToken: _encryptToken(resultRefreshToken)
                                });
                            }).catch(error => {
                                // expired refresh token error handling
                                if (error.name === 'TokenExpiredError') {
                                    return res.status(401).json({
                                        success: false,
                                        refreshTokenExpiredError: true,
                                    });
                                }
                                // default error handling
                                res.status(401).json({
                                    success: false,
                                    refreshTokenError: true,
                                    description: error
                                });
                            });

                    } else {
                        res.status(401).json({
                            success: false,
                            refreshTokenError: true,
                            description: 'Bad refresh token'
                        });
                    }
                }).catch(error => next(error));
        }
    };
};

/**
 * @description: checks ACCESS token from client request
 *
 * if token is valid define help object 'helpData' with current 'userId', 'userRole' fields
 * and pass to next middleware
 *
 * if access token is out of date >> send 'TokenExpiredError'
 *
 * if token is missing >> set 'helpData' object 'userId', 'userRole' fields to false
 * and pass to next middleware
 */
module.exports.checkToken = () => {
    return (req, res, next) => {
        let token = req.body.token || req.headers['token'];

        if (token) {
            token = _decryptToken(token);

            jwtp.verify(token, SECRET.access)
                .then(decoded => {
                    req.body.helpData = {
                        userId: decoded.sub,
                        userRole: decoded.userRole
                    };
                    return next();
                }).catch(error => {
                    if (error.name === 'TokenExpiredError') {
                        return res.status(401).json({
                            success: false,
                            accessTokenExpiredError: true
                        });
                    } else {
                        req.body.helpData = {
                            userId: false,
                            userRole: false
                        };
                        return next();
                    }
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
    return function (req, res, next) {
        User.GETbyId(req.params.id)
            .then(user => {
                return User.UPDATE(user.id, { refresh_token: null });
            })
            .then(() => {
                res.json({ success: true, description: 'User sign out system' });
            }).catch(error => next(error));
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
            res.status(400).json({ success: false, description: '\'password\' field not found' });
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
