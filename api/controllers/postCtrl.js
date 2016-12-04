'use strict';

var express = require('express');
var router = express.Router();

var Post = require('../models/post');

/**
 * baseUrl: post/
 */
router.get('/help',         help());      // Sends help route
router.get('/all',          getAll());    // Show list of all items
router.post('/',            create());    // Save item to the database
router.get('/:id',          read());      // Display item by id
router.put('/:id',          update());    // Update item details by id
router.delete('/:id',       remove());    // Delete item by id

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
 * ------------------------------
 * description: get all Posts
 * ------------------------------
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
 * ------------------------------
 * description: create Post
 * ------------------------------
 * url: post/
 * method: POST
 * request: {"user_id": "int", "title": "string", "content": "string"}
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
 * ------------------------------
 * description: get Post by id
 * ------------------------------
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
                    res.status(404).json({success: false, error: "Post id " + req.params.id + " not found"});
                }
            })
            .catch(function(error) {
                res.status(400).send(error);
            });
    }
}

/**
 * ------------------------------
 * description: update Post by id
 * ------------------------------
 * url: post/:id
 * method: PUT
 * request: {"title": "string", "content": "string"}
 */
function update() {
    return function(req, res) {
        Post.update(req.params.id, req.body)
            .then(function (model) {
                res.json(model);
            })
            .catch(function (error) {
                res.status(400).send(error.message);
            });
    }
}

/**
 * ------------------------------
 * description: remove Post from db by id
 * ------------------------------
 * url: post/:id
 * method: DELETE
 */
function remove() {
    return function(req, res) {
        Post.getById(req.params.id)
            .then(function (model) {
                if(model){
                    Post.remove(req.params.id)
                        .then(function () {
                            res.json({success: true, message: 'Post id ' + req.params.id + ' was removed'});
                        })
                        .catch(function(error) {
                            res.status(400).send(error);
                        });
                } else {
                    res.status(404).json({success: false, message: 'Post id ' + req.params.id + ' not found'});
                }
            })
            .catch(function (error) {
                res.status(400).send(error);
            });
    }
}

module.exports = router;
