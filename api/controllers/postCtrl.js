'use strict';

var express = require('express'),
    router = express.Router(),
    Post = require('../models/post');

/**
 * baseUrl: post/
 */
router.get('/help',         help());      // Sends route help
router.get('/all',          getAll());    // Show list of all users
router.post('/',            create());    // Save user to the database.
router.get('/:id',          read());      // Display user details using the id
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
 * description: get all Posts
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
                res.status(400).send(error);
            });
    }
}

/**
 * description: create Post
 * url: post/
 * method: POST
 * request: {"userId": "id", "title": "value", "content": "value"}
 */
function create() {
    return function(req, res) {
        Post.create(req.body)
            .then(function (model) {
                res.json(model);
            })
            .catch(function (error) {
                res.status(400).send(error);
            });
    }
}

/**
 * description: get Post by id
 * url: post/:id
 * method: GET
 */
function read() {
    return function(req, res) {
        Post.getById(req.params.id)
            .then(function(post) {
                if (post){
                    res.json({success: true, data: post});
                } else {
                    res.json({success: false, error: "id " + req.params.id + " not found"});
                }
            })
            .catch(function(error) {
                res.status(400).send(error);
            });
    }
}

module.exports = router;
