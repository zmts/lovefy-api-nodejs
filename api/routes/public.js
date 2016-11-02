'use strict';

module.exports = function() {
    var express = require('express'),
        router = express.Router(),
        root = require('../controllers');

    router.get('/', function (req, res) {
        res.send('Hello public routes');
    });

    router.post('/checkNameAvailability', root.checkNameAvailabilityCtrl.index());

    router.get('/getUsersList', root.getUsersListCtrl.index()); // << refactoring
    // router.get('/user',          root.userCtrl.index());     // Show list of all users
    // router.post('/user',         root.userCtrl.create());    // Save user to the database.
    // router.get('/user/:id',      root.userCtrl.read());      // Display user details using the id
    // router.put('/user/:id',      root.userCtrl.update());    // Update details for a given user with id.
    // router.delete('/user/:id',   root.userCtrl.delete());    // Delete a given user with id.

    return router;
};
