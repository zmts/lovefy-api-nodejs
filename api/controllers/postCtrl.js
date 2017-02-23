'use strict';

var express = require('express');
var router = express.Router();

var Post = require('../models/post');
var auth = require('../middleware/auth');
var sec = require('../middleware/security');

/**
 * BASE_URL: posts/
 */

/**
 * related routes
 */
router.get('/:id/tags',                 getTagsById());
router.post('/:id/attachTag/:tag_id',   attachTagToPost());

/**
 * base routes
 */
router.get('/all',              auth.checkToken(), sec.checkSUAccess(), getAllMix());
router.get('/public',           getAllPub());
router.get('/:id',              auth.checkToken(), sec.checkItemAccess.read(Post), getPost());

router.post('/',                auth.checkToken(), sec.checkItemAccess.create(), newPost());
router.put('/:id',              auth.checkToken(), sec.checkItemAccess.update(Post), update());
router.delete('/:id',           auth.checkToken(), sec.checkItemAccess.remove(Post), remove());

/**
 * ------------------------------
 * description: get Tags by Post id
 * ------------------------------
 * url: posts/:id/tags
 * method: GET
 */
function getTagsById() {
    return function (req, res) {
        console.log('tagsss');
    }
}

/**
 * ------------------------------
 * description: attach Tag to Post
 * ------------------------------
 * access: owner, SU, ADMINROLES
 * url: posts/:post_id/attachTag/:tag_id
 * method: POST
 */
function attachTagToPost() { 
    return function (req, res) {
        Post.checkTagByIdInPost(req.params.id, req.params.tag_id)
            .then(function () {
                return Post.attachTagToPost(req.params.id, req.params.tag_id)
            })
            .then(function (post) {
                res.json({success: true, data: post});
            })
            .catch(function (error) {
                res.status(error.statusCode || 403).send({success: false, description: error});
            })
    }
}

/**
 * ------------------------------
 * description: get all Posts of All users(public and private)
 * ------------------------------
 * access: only SU
 * url: posts/all
 * method: GET
 */
function getAllMix() {
    return function (req, res) {
        Post.getAllMix()
            .then(function (list) {
                res.json({success: true, data: list});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: get all public Posts of All Users
 * ------------------------------
 * access: public
 * url: posts/public
 * method: GET
 */
function getAllPub() {
    return function (req, res) {
        Post.getAllPub()
            .then(function (list) {
                res.json({success: true, data: list});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: create Post
 * ------------------------------
 * access: owner, SU, ADMINROLES
 * url: posts/
 * method: POST
 * request: {"user_id": "int", "title": "string", "content": "string"}
 */
function newPost() {
    return function (req, res) {
        delete req.body.helpData;
        Post.create(req.body)
            .then(function (post) {
                res.json({success: true, data: post});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: get Post by id
 * ------------------------------
 * access: privete posts accessible for owner, SU, ADMINROLES
 * url: posts/:id
 * method: GET
 */
function getPost() {
    return function (req, res) {
        Post.getById(req.params.id)
            .then(function (post) {
                res.json({success: true, data: post})
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: update Post by id
 * ------------------------------
 * access: owner, SU, ADMINROLES
 * url: posts/:id
 * method: PUT
 * request: {"title": "string", "content": "string"}
 */
function update() {
    return function (req, res) {
        delete req.body.helpData;
        Post.getById(req.params.id)
            .then(function (post) {
                return Post.update(post.id, req.body);
            })
            .then(function (updated_post) {
                res.json({success: true, data: updated_post});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: remove Post from db by id
 * ------------------------------
 * access: owner, SU, ADMINROLES
 * url: posts/:id
 * method: DELETE
 */
function remove() {
    return function (req, res) {
        Post.getById(req.params.id)
            .then(function (model) {
                return Post.remove(model.id);
            })
            .then(function () {
                res.json({success: true, description: 'Post #' + req.params.id + ' was removed'});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    }
}

module.exports = router;
