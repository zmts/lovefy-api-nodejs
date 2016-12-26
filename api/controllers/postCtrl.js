'use strict';

var express = require('express');
var router = express.Router();

var Post = require('../models/post');
var auth = require('../middleware/auth');
var sec = require('../middleware/security');

/**
 * baseUrl: post/
 */

/**
 * base routes
 */
router.get('/getAllMix',        auth.checkToken(), sec.checkSUAccess(), getAllMix());
router.get('/getAllPub',        getAllPub());
router.post('/',                auth.checkToken(), sec.checkItemCreateAccess(Post), makeNewPost());
router.get('/:id',              auth.checkToken(), sec.checkItemAccess(Post), getPost());
router.put('/:id',              auth.checkToken(), sec.checkItemAccess(Post), update());
router.delete('/:id',           auth.checkToken(), sec.checkItemAccess(Post), remove());

/**
 * ------------------------------
 * description: get all Posts of All users(public and private)
 * ------------------------------
 * url: post/getAllMix
 * method: GET
 */
function getAllMix() {
    return function (req, res) {
        Post.getAll()
            .then(function (list) {
                res.json({success: true, data: list});
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: get all public Posts
 * ------------------------------
 * url: post/getAllPub
 * method: GET
 */
function getAllPub() {
    return function (req, res) {
        Post.getAllPub()
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
        delete req.body.helpData;
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
                res.json({success: true, data: post})
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
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
                res.status(404).send({success: false, description: error});
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
                res.status(404).send({success: false, description: error});
            });
    }
}

module.exports = router;
