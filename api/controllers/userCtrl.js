'use strict';

var express = require('express'),
    router = express.Router(),
    User = require('../models/user');

/**
 * baseUrl: user/
 */
router.get('/help',         help());            // Sends route help
router.get('/all',          readAll());         // Show list of all users
router.get('/:id/posts',    readPosts());         // Show list of all posts related by user id
router.post('/',            create());          // Save user to the database
router.get('/:id',          read());            // Display user details using the id
router.put('/:id',          update());          // Update details for a given user with id
router.delete('/:id',       remove());          // Delete a given user with id

router.post('/checkNameAvailability', checkNameAvailability());


/**
 * url: user/help
 * method: GET
 */
function help() {
    return function(req, res) {
        res.send('User route help info');
    }
}

/**
 * description: get all Users
 * url: user/all
 * method: GET
 */
function readAll() {
    return function(req, res) {
        User.fetchAll({require: true})
            .then(function(list) {
                // console.log(list.serialize())
                res.json(list);
            })
            .catch(function(error) {
                res.status(400).send(error);
            });
    }
}

/**
 * description: show list of all Posts related by User id
 * url: user/user_id/posts
 * method: GET
 */
function readPosts() {
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (id) {
                if (id) {
                    User.getPosts(req.params.id)
                        .then(function (list) {
                            res.json({success: true, data: list.related('posts')});
                        })
                        .catch(function (error) {
                            res.status(400).send(error);
                        });
                } else {
                    res.status(404).json({success: false, error: "User id " + req.params.id + " not found"});
                }
            })
    }
}

/**
 * description: create user
 * url: user/
 * method: POST
 * request: {"name": "value"}
 */
function create() {
    return function(req, res) {
        User.create(req.body)
            .then(function (model) {
                res.json(model);
            })
            .catch(function (error) {
                res.status(400).send(error);
            });
    }
}

/**
 * description: get user by id
 * url: user/:id
 * method: GET
 */
function read() {
    return function(req, res) {
        User.getById(req.params.id)
            .then(function(user) {
                if (user){
                    res.json({success: true, data: user});
                } else {
                    res.status(404).json({success: false, error: "User id " + req.params.id + " not found"});
                }
            })
            .catch(function(error) {
                res.status(400).send(error);
            });
    }
}

/**
 * description: update user by id
 * url: user/:id
 * method: PUT
 */
function update() {
    return function(req, res) {
        User.update(req.params.id, req.body)
            .then(function (model) {
                res.json(model);
            })
            .catch(function (error) {
                res.status(400).send(error.message);
            });
    }
}

/**
 * description: remove user from db by id
 * url: user/:id
 * method: PUT
 */
function remove() {
    return function(req, res) {
        User.getById(req.params.id)
            .then(function (model) {
                if(model){
                    User.remove(req.params.id)
                        .then(function () {
                            res.json({success: true, message: 'User id ' + req.params.id + ' was removed'});
                        });
                } else {
                    res.status(404).json({success: false, message: 'User id ' + req.params.id + ' not found'});
                }
            })
            .catch(function (error) {
                res.status(400).send(error);
            });
    }
}

/**
 * description: check user name availability
 * url: user/checkNameAvailability
 * method: POST
 * request: {"name": "value"}
 */
function checkNameAvailability() {
    return function(req, res) {
        User.getByName(req.body.name)
            .then(function(model) {
                if (model) {
                    res.status(403).json({success: false, message: 'Not Available, name is taken'});
                } else {
                    res.json({success: true, message: 'Available, name is free'});
                }
            }).catch(function(error) {
                res.status(400).send(error.message);
            });
    }
}

module.exports = router;
