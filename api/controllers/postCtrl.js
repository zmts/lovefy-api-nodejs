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
router.patch('/:id',
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
 * @CONTROLLERS
 * ------------------------------
 */

/**
 * @description create and attach Tag to Post
 * @hasaccess OWNER, SU, ADMINROLES
 * @url POST: posts/:id/attachTag/
 * @request {"name": "string"}
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
 * @description attach Tag to Post
 * @hasaccess owner, SU, ADMINROLES
 * @url POST: posts/:id/attachTag/:tag_id
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
 * @description detach Tag From Post
 * @hasaccess owner, SU, ADMINROLES
 * @url POST: posts/:id/detachTag/:tag_id
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
 * @description get all Posts of All users(public and private)
 * @hasaccess only SU
 * @url GET: posts/all
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
 * @description get all public Posts of All Users
 * @hasaccess All
 * @url GET: posts/public
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
 * @description create Post
 * @hasaccess OWNER, SU, ADMINROLES
 * @url POST: posts/
 * @request {"user_id": "int", "title": "string", "content": "string"}
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
 * @description get Post by id
 * @hasaccess public posts for All
 * @hasaccess private posts for OWNER, SU, ADMINROLES
 * @url GET: posts/:id
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
 * @description update Post by id
 * @hasaccess OWNER, SU, ADMINROLES
 * @url PATCH: posts/:id
 * @request {"title": "string", "content": "string"}
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
 * @description remove Post from db by id
 * @hasaccess OWNER, SU, ADMINROLES
 * @url DELETE posts/:id
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
