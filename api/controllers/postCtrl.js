'use strict';

var express = require('express');
var router = express.Router();

var Post = require('../models/post');

/**
 * baseUrl: post/
 */
router.get('/getAllPublic',     getAllPublic());
router.post('/',                makeNewPost());
router.get('/:id',              getPost());
router.put('/:id',              update());
router.delete('/:id',           remove());

/**
 * ------------------------------
 * description: get all Posts
 * ------------------------------
 * url: post/all
 * method: GET
 */
function getAllPublic() {
    return function (req, res) {
        Post.getAllPublic()
            .then(function (list) {
                res.json({success: true, data: list});
            }).catch(function (error) {
                res.status(400).send({success: false, description: error});
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
function makeNewPost() {
    return function (req, res) {
        Post.create(req.body)
            .then(function (post) {
                res.json({success: true, data: post});
            }).catch(function (error) {
                res.status(400).send({success: false, description: error});
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
function getPost() {
    return function (req, res) {
        Post.getById(req.params.id)
            .then(function (post) {
                    res.json({success: true, data: post});
            }).catch(function (error) {
                res.status(400).send({success: false, description: error});
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
    return function (req, res) {
        Post.getById(req.params.id)
            .then(function (post) {
                Post.update(post.id, req.body)
                    .then(function (updated_post) {
                        res.json({success: true, data: updated_post});
                    }).catch(function (error) {
                        res.status(400).send({success: false, description: error});
                    });
            }).catch(function (error) {
                res.status(400).send({success: false, description: error});
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
    return function (req, res) {
        Post.getById(req.params.id)
            .then(function (model) {
                Post.remove(model.id)
                    .then(function () {
                        res.json({success: true, description: 'Post id ' + model.id + ' was removed'});
                    }).catch(function (error) {
                        res.status(400).send({success: false, description: error});
                    });
            }).catch(function (error) {
                res.status(400).send({success: false, description: error});
            });
    }
}

module.exports = router;
