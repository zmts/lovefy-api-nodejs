'use strict';

var bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    secret = require('../config').token.secret,
    User = require('../models/user');

module.exports.makeToken = function() {
    return function (req, res) {
        User.getByEmail(req.body.email)
            .then(function (user) {
                if (user){
                    var playload = {
                        username: user.get('name'),
                    };

                    var options = {
                        algorithm: 'HS512',
                        expiresIn: '5m',
                        subject: user.get('id').toString()
                    };

                    jwt.sign(playload, secret, options, function(error, token) {
                        if (token) {
                            res.json({
                                success: true,
                                token: token
                            });
                        } else {
                            res.status(400).json({success: false, description: error})
                        }
                    })
                } else {
                    res.status(400).json({success: false});
                }
            })
    }
};

module.exports.checkToken = function () {
    return function (req, res, next) {
        var token = req.body.token || req.headers['token'];
        jwt.verify(token, secret, function(error, decoded) {
            if (decoded) { next() }
            else { res.status(401).json({success: false, description: error}) }
        })
    }
};

module.exports.signOut = function() {
    return function (req, res) {
        res.json({success: true, description: 'User sign out system'});
    }
};

/**
 * description: help middleware,
 * makes hash for password at User creation
 */
module.exports.hashPassword = function() {
    return function(req, res, next){
        if (req.body.password_hash) {
            bcrypt.genSalt(10, function(error, salt) {
                bcrypt.hash(req.body.password_hash, salt, function(error, hash) {
                    if (error) { res.status(400).json({success: false, description: error}) }
                    else { req.body.password_hash = hash; next() }
                })
            })
        }
        else { res.status(400).json({success: false, description: 'Password("password_hash" field) not found'}) }
    }
};



module.exports.checkPassword = function() {
    return function (req, res, next) {
        User.getByEmail(req.body.email)
            .then(function (model) {
                bcrypt.compare(req.body.password, model.get('password_hash'), function(error, result) {
                    if (result) { next() }
                    else { res.status(403).json({success: false, description: 'Invalid password'}) }
                })
            })
    }
};

module.exports.checkNameAvailability = function() {
    return function(req, res, next) {
        User.getByName(req.body.name)
            .then(function(model) {
                next();
            }).catch(function(error) {
            res.status(400).send({success: false, description: error});
        })
    }
};

module.exports.checkEmailAvailability = function() {
    return function(req, res, next) {
        User.getByEmail(req.body.email)
            .then(function(model) {
                    next();
            }).catch(function(error) {
            res.status(400).send({success: false, description: error});
        })
    }
};


