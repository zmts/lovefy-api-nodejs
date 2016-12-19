'use strict';

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SECRET = require('../config').token.secret;
var User = require('../models/user');

module.exports.makeToken = function () {
    return function (req, res) {
        User.getByEmail(req.body.email)
            .then(function (user) {
                var playload = {
                    username: user.get('name'),
                    userRole: user.get('role')
                };

                var options = {
                    algorithm: 'HS512',
                    expiresIn: '15m',
                    subject: user.get('id').toString()
                };

                jwt.sign(playload, SECRET, options, function (error, token) {
                    if (token) { return res.json({ success: true, token: token}) }
                    res.status(400).json({success: false, description: error})
                });

            }).catch(function (error) {
            res.status(404).send({success: false, description: error});
        });
    }
};

/**
 * description: checks token from client request
 * if token is valid define help object 'helpData'
 * and pass to next middleware
 */
module.exports.checkToken = function () {
    return function (req, res, next) {
        var token = req.body.token || req.headers['token'];
        if (token) {
            jwt.verify(token, SECRET, function (error, decoded) {
                if (decoded) {
                    req.body.helpData = {
                        userId: decoded.sub,
                        userRole: decoded.userRole
                    };
                    return next();
                }
                res.status(401).json({success: false, description: error});
            })
        } else {
            req.body.helpData = {userIsAuth: false}; // 'userIsAuth' just for logs; don't uses any more
            return next();
        }

    }
};

module.exports.signOut = function () {
    return function (req, res) {
        res.json({success: true, description: 'User sign out system'});
    }
};

/**
 * description: help middleware,
 * makes hash for password at User creation
 */
module.exports.hashPassword = function () {
    return function(req, res, next) {
        if (req.body.password) {
            bcrypt.genSalt(10, function (error, salt) {
                bcrypt.hash(req.body.password, salt, function (error, hash) {
                    if (error) { return res.status(400).json({success: false, description: error}) }
                    req.body.password_hash = hash; // transfers and saves to DB
                    delete req.body.password;
                    next();
                })
            })
        }
        else {
            res.status(400).json({success: false, description: 'Password("password_" field) not found'})
        }
    }
};

module.exports.checkPassword = function () {
    return function (req, res, next) {
        User.getByEmail(req.body.email)
            .then(function (user) {
                bcrypt.compare(req.body.password, user.get('password_hash'), function(error, result) {
                    if (result) { return next() }
                    res.status(403).json({success: false, description: 'Invalid password'})
                });
            }).catch(function (error) {
            res.status(404).send({success: false, description: error});
        });
    }
};
