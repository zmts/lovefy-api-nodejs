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
router.post('/:id/create-attach-tag',
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
router.get('/',
    auth.checkToken(),
    sec.isAdmin(),
    getAll()
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
 * @url POST: posts/:id/create-attach-tag
 * @request {"name": "string"}
 */
function createAndAttachTagToPost() {
    return function (req, res, next) {
        delete req.body.helpData;
        Tag.CREATE(req.body)
            .then(function (tag) {
                return Post.AttachTagToPost(req.params.id, tag.id);
            })
            .then(function (post) {
                res.json({ success: true, data: post });
            }).catch(next);
    };
}

/**
 * @description attach Tag to Post
 * @hasaccess owner, SU, ADMINROLES
 * @url POST: posts/:id/attachTag/:tag_id
 */
function attachTagToPost() {
    return function (req, res, next) {
        Post.CheckTagByIdInPost(req.params.id, req.params.tag_id)
            .then(function () {
                return Post.AttachTagToPost(req.params.id, req.params.tag_id);
            })
            .then(function (post) {
                res.json({ success: true, data: post });
            }).catch(next);
    };
}

/**
 * @description detach Tag From Post
 * @hasaccess owner, SU, ADMINROLES
 * @url POST: posts/:id/detachTag/:tag_id
 */
function detachTagFromPost () {
    return function (req, res, next) {
        Post.DetachTagFromPost(req.params.id, req.params.tag_id)
            .then(function () {
                res.json({ success: true, data: `Tag#${req.params.tag_id} is detached from Post#${req.params.id}` });
            }).catch(next);
    };
}

/**
 * @description get all Posts of All users
 * @url GET: posts/
 * @return if ADMINROLES >> All mix POST's
 * @return if not ADMINROLES >> All public POST's
 */
function getAll() {
    return function (req, res, next) {
        Post.GetAllPostsAccessSwitcher(req.body.helpData.isAdmin)
            .then(function (list) {
                res.json({ success: true, data: list });
            }).catch(next);
    };
}

/**
 * @description create Post
 * @hasaccess OWNER, SU, ADMINROLES
 * @url POST: posts/
 * @request {"user_id": "int", "title": "string", "content": "string"}
 */
function newPost() {
    return function (req, res, next) {
        delete req.body.helpData;
        Post.CREATE(req.body)
            .then(function (post) {
                res.status(201).json({ success: true, data: post });
            }).catch(next);
    };
}

/**
 * @description get Post by id
 * @hasaccess public posts for All
 * @hasaccess private posts for OWNER, SU, ADMINROLES
 * @url GET: posts/:id
 */
function getPost() {
    return function (req, res, next) {
        Post.GetById(req.params.id)
            .then(function (post) {
                res.json({ success: true, data: post });
            }).catch(next);
    };
}

/**
 * @description update Post by id
 * @hasaccess OWNER, SU, ADMINROLES
 * @url PATCH: posts/:id
 * @request {"title": "string", "content": "string"}
 */
function update() {
    return function (req, res, next) {
        delete req.body.helpData;
        Post.UPDATE(req.params.id, req.body)
            .then(function (updated_post) {
                res.json({ success: true, data: updated_post });
            }).catch(next);
    };
}

/**
 * @description remove Post from db by id
 * @hasaccess OWNER, SU, ADMINROLES
 * @url DELETE posts/:id
 */
function remove() {
    return function (req, res, next) {
        Post.REMOVE(req.params.id)
            .then(function () {
                res.json({ success: true, description: `Post #${req.params.id} was removed` });
            }).catch(next);
    };
}

module.exports = router;
