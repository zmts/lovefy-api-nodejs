'use strict';

var express = require('express'),
    router = express.Router(),
    User = require('../models/user');

router.get('/all',              index());     // Show list of all users
// router.post('/user',         create());    // Save user to the database.
// router.get('/user/:id',      read());      // Display user details using the id
// router.put('/user/:id',      update());    // Update details for a given user with id.
// router.delete('/user/:id',   delete());    // Delete a given user with id.
// router.get('/help',          help());      // Sends route help

router.post('/checkNameAvailability', checkNameAvailability());

function index() {
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

function checkNameAvailability() {
    return function(req, res) {
        User.getName(req.body.name)
            .then(function(model) {
                if (model) {
                    res.json({success: false, message: 'Not Available'});
                } else {
                    res.json({success: true, message: 'Available'});
                }
            }).catch(function(err) {
                res.status(400).send(err.message);
            });
    }
}

module.exports = router;
