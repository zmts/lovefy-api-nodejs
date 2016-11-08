'use strict';

var express = require('express'),
    router = express.Router(),
    Post = require('../models/post');

/**
 * baseUrl: user/
 */
router.get('/help',         help());      // Sends route help
router.get('/all',          getAll());    // Show list of all users
// router.post('/',            create());    // Save user to the database.
// router.get('/:id',          read());      // Display user details using the id
// router.put('/:id',          update());    // Update details for a given user with id.
// router.delete('/:id',       remove());    // Delete a given user with id.

/**
 * url: post/help
 * method: GET
 */
function help() {
    return function(req, res) {
        res.send('post help info');
    }
}

/**
 * description: Get all Posts
 * url: post/all
 * method: GET
 */
function getAll() {
    return function(req, res) {
        Post.fetchAll()
            .then(function(list) {
                // console.log(list.serialize())
                res.json(list);
            })
            .catch(function(error) {
                res.send(error);
            });
    }
}

module.exports = router;
