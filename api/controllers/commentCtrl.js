'use strict';

const express = require('express');
const router = express.Router();

const Comment = require('../models/comment');

const auth = require('../middleware/auth');
const sec = require('../middleware/security');
const validate = require('../middleware/validateReq');

/**
 * ------------------------------------------------------------
 * @BASE_URL: comments/
 * ------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------
 * @BASE_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description add comment to Post
 * @hasaccess All
 */
router.post('/post/:post_id',
    validate.id(),
    validate.body(Comment.rules.CreateUpdate),
    auth.checkToken(),
    sec.checkLoggedInUserAccess(),
    addCommentToPost()
);

/**
 * @description add comment to Album
 * @hasaccess All
 */
router.post('/album/:album_id',
    validate.id(),
    validate.body(Comment.rules.CreateUpdate),
    auth.checkToken(),
    sec.checkLoggedInUserAccess(),
    addCommentToAlbum()
);

/**
 * @description add comment to Photo
 * @hasaccess All
 */
router.post('/photo/:photo_id',
    validate.id(),
    validate.body(Comment.rules.CreateUpdate),
    auth.checkToken(),
    sec.checkLoggedInUserAccess(),
    addCommentToPhoto()
);

/**
 * @description update comment
 * @hasaccess ADMINROLES, Owner
 */
router.patch('/:id',
    validate.id(),
    validate.body(Comment.rules.CreateUpdate),
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Comment),
    updateCommentPost()
);

/**
 * @description delete comment
 * @hasaccess ADMINROLES, Owner
 */
router.delete('/:id',
    validate.id(),
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Comment),
    deleteCommentPost()
);

/**
 * ------------------------------------------------------------
 * @CONTROLLERS
 * ------------------------------------------------------------
 */

function addCommentToPost () {
    return (req, res, next) => {
        req.body.entity_id = req.params.post_id;
        req.body.type = 'post';
        req.body.user_id = req.body.helpData.userId;

        delete req.body.helpData;

        Comment.CREATE(req.body)
            .then(model => {
                res.status(201).json({ success: true, data: model });
            }).catch(next);
    };
}

function addCommentToAlbum () {
    return (req, res, next) => {
        req.body.entity_id = req.params.album_id;
        req.body.type = 'album';
        req.body.user_id = req.body.helpData.userId;

        delete req.body.helpData;

        Comment.CREATE(req.body)
            .then(model => {
                res.status(201).json({ success: true, data: model });
            }).catch(next);
    };
}

function addCommentToPhoto () {
    return (req, res, next) => {
        req.body.entity_id = req.params.photo_id;
        req.body.type = 'photo';
        req.body.user_id = req.body.helpData.userId;

        delete req.body.helpData;

        Comment.CREATE(req.body)
            .then(model => {
                res.status(201).json({ success: true, data: model });
            }).catch(next);
    };
}

function updateCommentPost () {
    return (req, res, next) => {
        delete req.body.helpData;

        Comment.UPDATE(req.params.id, req.body)
            .then(model => {
                res.status(201).json({ success: true, data: model });
            }).catch(next);
    };
}

function deleteCommentPost () {
    return (req, res, next) => {
        Comment.REMOVE(req.params.id)
            .then(() => {
                res.json({ success: true, description: `Comment #${req.params.id} was removed` });
            }).catch(next);
    };
}

module.exports = router;
