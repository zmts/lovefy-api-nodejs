'use strict';

const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const Tag = require('../models/tag');

const auth = require('../middleware/auth');
const sec = require('../middleware/security');
const validate = require('../middleware/validateReq');

/**
 * ------------------------------------------------------------
 * @BASE_URL: posts/
 * ------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------
 * @RELATED_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description create and attach Tag to Post
 * @hasaccess OWNER, SU, ADMINROLES
 * @request {"name": "string"}
 */
router.post('/:id/create-attach-tag',
    validate.id(),
    validate.body(Tag.rules.CreateUpdate),
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Post),
    createAndAttachTagToPost()
);

/**
 * @description attach Tag to Post
 * @hasaccess owner, SU, ADMINROLES
 */
router.post('/:id/attach-tag/:tag_id',
    validate.id(),
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Post),
    attachTagToPost()
);

/**
 * @description detach Tag From Post
 * @hasaccess owner, SU, ADMINROLES
 */
router.post('/:id/detach-tag/:tag_id',
    validate.id(),
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Post),
    detachTagFromPost()
);

/**
 * ------------------------------------------------------------
 * @BASE_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description get all POST's list
 * @url posts?page=0
 * @return ADMINROLES >> fetch all mix POSTS's of all users
 * @return not ADMINROLES >> fetch all public POST's of all users
 */
router.get('/',
    auth.checkTokenFreePass(),
    sec.isAdmin(),
    getAll()
);

/**
 * @description get Post by id
 * @hasaccess public posts for All
 * @hasaccess private posts for OWNER, SU, ADMINROLES
 */
router.get('/:id',
    validate.id(),
    auth.checkToken(),
    sec.checkItemAccess.read(Post),
    getPost()
);

/**
 * @description create Post
 * @hasaccess OWNER, SU, ADMINROLES
 * @request {"user_id": "int", "title": "string", "content": "string"}
 */
router.post('/',
    validate.body(Post.rules.CreateUpdate),
    auth.checkToken(),
    sec.checkItemAccess.create(),
    newPost()
);

/**
 * @description update Post by id
 * @hasaccess OWNER, SU, ADMINROLES
 * @request {"title": "string", "content": "string"}
 */
router.patch('/:id',
    validate.id(),
    validate.body(Post.rules.CreateUpdate),
    auth.checkToken(),
    sec.checkItemAccess.update(Post),
    update()
);

/**
 * @description remove Post from db by id
 * @hasaccess OWNER, SU, ADMINROLES
 */
router.delete('/:id',
    validate.id(),
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Post),
    remove()
);

/**
 * ------------------------------------------------------------
 * @CONTROLLERS
 * ------------------------------------------------------------
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

function detachTagFromPost () {
    return function (req, res, next) {
        Post.DetachTagFromPost(req.params.id, req.params.tag_id)
            .then(function () {
                res.json({ success: true, data: `Tag#${req.params.tag_id} is detached from Post#${req.params.id}` });
            }).catch(next);
    };
}

function getAll() {
    return function (req, res, next) {
        _getAllAccessSwitcher(req.body.helpData.isAdmin, +req.query.page)
            .then(function (list) {
                res.json({ success: true, data: list });
            }).catch(next);
    };
}

/**
 * @description getAll access helper
 * @param isAdmin BOOLEAN
 * @param queryPage INT
 * @private
 */
function _getAllAccessSwitcher(isAdmin, queryPage) {
    if (isAdmin) return Post.GetMixList(queryPage);
    return Post.GetPubList(queryPage);
}

function newPost() {
    return function (req, res, next) {
        delete req.body.helpData;
        Post.CREATE(req.body)
            .then(function (post) {
                res.status(201).json({ success: true, data: post });
            }).catch(next);
    };
}

function getPost() {
    return function (req, res, next) {
        Post.GetById(req.params.id)
            .then(function (post) {
                res.json({ success: true, data: post });
            }).catch(next);
    };
}

function update() {
    return function (req, res, next) {
        delete req.body.helpData;
        Post.UPDATE(req.params.id, req.body)
            .then(function (updated_post) {
                res.json({ success: true, data: updated_post });
            }).catch(next);
    };
}

function remove() {
    return function (req, res, next) {
        Post.Remove(req.params.id)
            .then(function () {
                res.json({ success: true, description: `Post #${req.params.id} was removed` });
            }).catch(next);
    };
}

module.exports = router;
