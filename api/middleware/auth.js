'use strict';

var bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    moment = require('moment'),
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
                        algorithm: 'HS384',
                        expiresIn: moment().add(1, 'days').unix(),
                        subject: user.get('id').toString()
                    };

                    var token = jwt.sign(playload, secret, options);

                    res.json({
                        success: true,
                        message: 'Password accepted',
                        token: token
                    });
                } else {
                    res.json({success: false});
                }
            })
    }
};

module.exports.checkToken = function () {
    return function (req, res, next) {
        console.log('check Token');
    }
};

module.exports.signOut = function() {
    return function (req, res) {
        res.json({success: true, message: 'User sign out system'});
    }
};

/**
 * description: help middleware to create User,
 * makes hash for password at User creation
 */
module.exports.hashPassword = function() {
    return function(req, res, next){
        bcrypt.genSalt(10, function(error, salt) {
            bcrypt.hash(req.body.password_hash, salt, function(error, hash) {
                if (error) {
                    res.json({success: false, message: error});
                } else {
                    req.body.password_hash = hash;
                    next();
                }
            });
        });
    }
};

module.exports.checkPassword = function() {
    return function (req, res, next) {
        User.getByEmail(req.body.email)
            .then(function (model) {
                bcrypt.compare(req.body.password, model.get('password_hash'), function(error, result) {
                    if (result) {
                        next();
                    } else {
                        res.status(403).json({success: false, message: 'Invalid password'});
                    }
                });
            })
    }
};

module.exports.checkNameAvailability = function() {
    return function(req, res, next) {
        User.getByName(req.body.name)
            .then(function(model) {
                if (model) {
                    next();
                } else {
                    res.status(403).json({success: false, message: 'Not found'});
                }
            }).catch(function(error) {
            res.status(400).send(error.message);
        });
    }
};

module.exports.checkEmailAvailability = function() {
    return function(req, res, next) {
        User.getByEmail(req.body.email)
            .then(function(model) {
                if (model) {
                    next();
                } else {
                    res.status(403).json({success: false, message: 'Not found'});
                }
            }).catch(function(error) {
            res.status(400).send(error.message);
        });
    }
};


