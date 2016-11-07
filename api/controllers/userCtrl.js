'use strict';

var express = require('express'),
    router = express.Router(),
    User = require('../models/user');

router.get('/help',         help());      // Sends route help
router.get('/all',          getAll());    // Show list of all users
router.post('/',            create());    // Save user to the database.
router.get('/:id',          read());      // Display user details using the id
// router.put('/:id',       update());    // Update details for a given user with id.
// router.delete('/:id',    delete());    // Delete a given user with id.

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
                res.send(error);
            });
    }
}

/**
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
            }).catch(function(err) {
                res.status(400).send(err.message);
            });
    }
}

module.exports = router;
