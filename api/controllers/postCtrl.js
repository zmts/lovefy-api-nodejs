'use strict';

const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const Tag = require('../models/tag');

const auth = require('../middleware/auth');
const sec = require('../middleware/security');

/**
 * ------------------------------
 * @BASE_URL: posts/
 * ------------------------------
 */

/**
 * ------------------------------
 * @RELATED_ROUTES
 * ------------------------------
 */
router.post('/:id/attach-tag',
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Post),
    createAndAttachTagToPost()
);
router.post('/:id/attach-tag/:tag_id',
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Post),
    attachTagToPost()
);
router.post('/:id/detach-tag/:tag_id',
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Post),
    detachTagFromPost()
);

/**
 * ------------------------------
 * @BASE_ROUTES
 * ------------------------------
 */
router.get('/all',
    auth.checkToken(),
    sec.checkSUAccess(),
    getAllMix()
);
router.get('/public',
    getAllPub()
);
router.get('/:id',
    auth.checkToken(),
    sec.checkItemAccess.read(Post),
    getPost()
);
router.post('/',
    auth.checkToken(),
    sec.checkItemAccess.create(),
    newPost()
);
router.put('/:id',
    auth.checkToken(),
    sec.checkItemAccess.update(Post),
    update()
);
router.delete('/:id',
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Post),
    remove()
);

/**
 * ------------------------------
 * @description: create and attach Tag to Post
 * ------------------------------
 * @hasaccess: owner, SU, ADMINROLES
 * @url: posts/:id/attachTag/
 * @verb: POST
 * @request: {"name": "string"}
 */
function createAndAttachTagToPost() {
    return function (req, res) {
        delete req.body.helpData;
        Tag.CREATE(req.body)
            .then(function (tag) {
                return Post.attachTagToPost(req.params.id, tag.id);
            })
            .then(function (post) {
                res.json({ success: true, data: post });
            })
            .catch(function (error) {
                res.status(error.statusCode || 403).send({ success: false, description: error });
            });
    };
}

/**
 * ------------------------------
 * @description: attach Tag to Post
 * ------------------------------
 * @hasaccess: owner, SU, ADMINROLES
 * @url: posts/:id/attachTag/:tag_id
 * @verb: POST
 */
function attachTagToPost() {
    return function (req, res) {
        Post.checkTagByIdInPost(req.params.id, req.params.tag_id)
            .then(function () {
                return Post.attachTagToPost(req.params.id, req.params.tag_id);
            })
            .then(function (post) {
                res.json({ success: true, data: post });
            })
            .catch(function (error) {
                res.status(error.statusCode || 403).send({ success: false, description: error });
            });
    };
}

/**
 * ------------------------------
 * @description: detach Tag From Post
 * ------------------------------
 * @hasaccess: owner, SU, ADMINROLES
 * @url: posts/:id/detachTag/:tag_id
 * @method: POST
 */
function detachTagFromPost () {
    return function (req, res) {
        Post.detachTagFromPost(req.params.id, req.params.tag_id)
            .then(function () {
                res.json({ success: true, data: 'Tag#' + req.params.tag_id + ' is detached from ' + 'Post#' + req.params.id });
            })
            .catch(function (error) {
                res.status(error.statusCode || 403).send({ success: false, description: error });
            });
    };
}

/**
 * ------------------------------
 * @description: get all Posts of All users(public and private)
 * ------------------------------
 * @hasaccess: only SU
 * @url: posts/all
 * @verb: GET
 */
function getAllMix() {
    return function (req, res) {
        Post.getAllMix()
            .then(function (list) {
                res.json({ success: true, data: list });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * ------------------------------
 * @description: get all public Posts of All Users
 * ------------------------------
 * @hasaccess: All
 * @url: posts/public
 * @verb: GET
 */
function getAllPub() {
    return function (req, res) {
        Post.getAllPub()
            .then(function (list) {
                res.json({ success: true, data: list });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * ------------------------------
 * @description: create Post
 * ------------------------------
 * @hasaccess: owner, SU, ADMINROLES
 * @url: posts/
 * @verb: POST
 * @request: {"user_id": "int", "title": "string", "content": "string"}
 */
function newPost() {
    return function (req, res) {
        delete req.body.helpData;
        Post.CREATE(req.body)
            .then(function (post) {
                res.status(201).json({ success: true, data: post });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * ------------------------------
 * @description: get Post by id
 * ------------------------------
 * @hasaccess: public posts for All
 * @hasaccess: private posts for owner, SU, ADMINROLES
 * @url: posts/:id
 * @verb: GET
 */
function getPost() {
    return function (req, res) {
        Post.getById(req.params.id)
            .then(function (post) {
                res.json({ success: true, data: post });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * ------------------------------
 * @description: update Post by id
 * ------------------------------
 * @hasaccess: owner, SU, ADMINROLES
 * @url: posts/:id
 * @verb: PUT
 * @request: {"title": "string", "content": "string"}
 */
function update() {
    return function (req, res) {
        delete req.body.helpData;
        Post.GETbyId(req.params.id)
            .then(function (post) {
                return Post.UPDATE(post.id, req.body);
            })
            .then(function (updated_post) {
                res.json({ success: true, data: updated_post });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * ------------------------------
 * @description: remove Post from db by id
 * ------------------------------
 * @hasaccess: owner, SU, ADMINROLES
 * @url: posts/:id
 * @verb: DELETE
 */
function remove() {
    return function (req, res) {
        Post.GETbyId(req.params.id)
            .then(function (model) {
                return Post.remove(model.id);
            })
            .then(function () {
                res.json({ success: true, description: 'Post #' + req.params.id + ' was removed' });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

module.exports = router;
