'use strict';

var express = require('express'),
    router = express.Router(),
    User = require('../models/user');

/**
 * baseUrl: user/
 */
router.get('/help',         help());      // Sends route help
router.get('/all',          getAll());    // Show list of all users
router.post('/',            create());    // Save user to the database.
router.get('/:id',          read());      // Display user details using the id
router.put('/:id',          update());    // Update details for a given user with id.
router.delete('/:id',       remove());    // Delete a given user with id.

router.post('/checkNameAvailability', checkNameAvailability());


/**
 * url: user/help
 * method: GET
 */
function help() {
    return function(req, res) {
        res.send('help info');
    }
}

/**
 * description: Get all Users
 * url: user/all
 * method: GET
 */
function getAll() {
    return function(req, res) {
        User.fetchAll()
            .then(function(list) {
                // console.log(list.serialize())
                res.json(list);
            })
            .catch(function(error) {
                res.send(error);
            });
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
                    res.json({success: false, error: "id " + req.params.id + " not found"});
                }
            })
            .catch(function(error) {
                res.send(error);
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
                            res.json({success: true, message: 'Id ' + req.params.id + ' was removed'});
                        });
                } else {
                    res.json({success: false, message: 'Id ' + req.params.id + ' does not exist'});
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
                    res.json({success: false, message: 'Not Available, name is taken'});
                } else {
                    res.json({success: true, message: 'Available, name is free'});
                }
            }).catch(function(error) {
                res.status(400).send(error.message);
            });
    }
}

module.exports = router;
