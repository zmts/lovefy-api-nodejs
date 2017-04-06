'use strict';

const express = require('express');
const router = express.Router();

const Tag = require('../models/tag');
const auth = require('../middleware/auth');
const sec = require('../middleware/security');

/**
 * ------------------------------------------------------------
 * @BASE_URL: tags/
 * ------------------------------------------------------------
 */

/**
 * @OTHER_ROUTES
 */

/**
 * @description find tag by substring
 * @url GET: tags/find?q=sometagname
 * @hasaccess: All
 */
router.get('/find',
    auth.checkToken(),
    sec.checkLoggedInUserAccess(),
    findByString()
);

/**
 * ------------------------------------------------------------
 * @RELATED_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @return all public POST's of all Users by tag_id
 * @url /tags/:id/posts?page=0
 */
router.get('/:id/posts',
    getPostsByTagId()
);

/**
 * @return all public ALBUM's of all users by tag_id
 * @url /tags/:id/albums?page=0
 */
router.get('/:id/albums',
    getAlbumsByTagId()
);

/**
 * ------------------------------------------------------------
 * @BASE_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description get all Tags list
 */
router.get('/',
    getAll()
);

/**
 * @description create Tag
 * @request {"name": "string"}
 */
router.post('/',
    auth.checkToken(),
    sec.checkLoggedInUserAccess(),
    newTag()
);

/**
 * @description update Tag by id
 * @request {"name": "string"}
 */
router.patch('/:id',
    auth.checkToken(),
    sec.checkAdminRoleAccess(),
    update()
);

/**
 * @description remove Tag from db by id
 */
router.delete('/:id',
    auth.checkToken(),
    sec.checkAdminRoleAccess(),
    remove()
);

/**
 * ------------------------------------------------------------
 * @CONTROLLERS
 * ------------------------------------------------------------
 */

function findByString() {
    return function (req, res, next) {
        Tag.FindByString(req.query.q)
            .then(function (list) {
                res.json({ success: true, data: list });
            }).catch(next);
    };
}

function getPostsByTagId () {
    return function (req, res, next) {
        Tag.GetPubPostsByTagId(req.params.id, +req.query.page)
            .then(function (list) {
                res.json({ success: true, data: list });
            }).catch(next);
    };
}

function getAlbumsByTagId() {
    return function (req, res, next) {
        Tag.GetPubAlbumsByTagId(req.params.id, +req.query.page)
            .then(function (list) {
                res.json({ success: true, data: list });
            }).catch(next);
    };
}

function getAll() {
    return function (req, res, next) {
        Tag.GETall()
            .then(function (list) {
                res.json({ success: true, data: list });
            }).catch(next);
    };
}

function newTag() {
    return function (req, res, next) {
        delete req.body.helpData;
        Tag.CREATE(req.body)
            .then(function (tag) {
                res.json({ success: true, data: tag });
            }).catch(next);
    };
}

function update() {
    return function (req, res, next) {
        delete req.body.helpData;
        Tag.GETbyId(req.params.id)
            .then(function (tag) {
                return Tag.UPDATE(tag.id, req.body);
            })
            .then(function (updated_tag) {
                res.json({ success: true, data: updated_tag });
            }).catch(next);
    };
}

function remove() {
    return function (req, res, next) {
        Tag.GETbyId(req.params.id)
            .then(function (model) {
                return Tag.REMOVE(model.id);
            })
            .then(function () {
                res.json({ success: true, description: `Tag #${req.params.id} was removed` });
            }).catch(next);
    };
}

module.exports = router;
