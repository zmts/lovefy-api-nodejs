'use strict';

const express = require('express');
const router = express.Router();

const Tag = require('../models/tag');
const auth = require('../middleware/auth');
const sec = require('../middleware/security');

/**
 * ------------------------------
 * @BASE_URL: tags/
 * ------------------------------
 */

/**
 * @OTHER_ROUTES
 */
router.get('/find',
    findByString()
);

/**
 * @RELATED_ROUTES
 */
router.get('/:id/posts',
    auth.checkToken(),
    getPostsByTagId()
);

/**
 * @BASE_ROUTES
 */
router.get('/',
    getAll()
);
router.get('/:id',
    getTag()
);
router.post('/',
    auth.checkToken(),
    sec.checkSUAccess(),
    newTag()
);
router.put('/:id',
    auth.checkToken(),
    sec.checkSUAccess(),
    update()
);
router.delete('/:id',
    auth.checkToken(),
    sec.checkSUAccess(),
    remove()
);

/**
 * ------------------------------
 * @description: find tag by substring
 * ------------------------------
 * @url: tags/find?q=sometagname
 * @verb: GET
 * @hasaccess: All
 */
function findByString() {
    return function (req, res) {
        Tag.findByString(req.query.q)
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
 * @description: get Tag by id
 * ------------------------------
 * @hasaccess: All
 * @url: tags/:id
 * @verb: GET
 */
function getTag () {
    return function (req, res) {
        Tag.GETbyId(req.params.id)
            .then(function (model) {
                res.json({ success: true, data: model });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * ------------------------------
 * @description: get Posts by tag id
 *
 * @url: tags/:id/posts
 * @hasaccess: Owner of POST model >> response with full list of current USER POSTS and other USERS public POSTS
 * @hasaccess: Anonymous, NotOwner >> response only with public POSTS list
 *
 * @url: tags/:id/posts?clear=true
 * @hasaccess: Owner of POST model >> response only with full list of current USER
 * @hasaccess: Anonymous, NotOwner >> response only with public POSTS list
 *
 * @verb: GET
 * ------------------------------
 */
function getPostsByTagId () {
    return function (req, res) {
        Tag.GETbyId(req.params.id)
            .then(function (tag) {
                if ( req.body.helpData.userId && !req.query.clear ) {
                    return Tag.getMixPostsByTagId(req.body.helpData.userId, tag.id);
                }
                if ( req.body.helpData.userId && req.query.clear ) {
                    return Tag.getCurrentUserPostsByTagId(req.body.helpData.userId, tag.id);
                }
                return Tag.getPublicPostsByTagId(tag.id);
            })
            .then(function (list) {
                res.json({success: true, data: list});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    };
}

/**
 * ------------------------------
 * @description: get all Tags list
 * ------------------------------
 * @url: tags/
 * @verb: GET
 * @hasaccess: All
 */
function getAll() {
    return function (req, res) {
        Tag.GETall()
            .then(function (list) {
                res.json({ success: true, data: list });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    };
}

/**
 * ------------------------------
 * @description: create Tag
 * ------------------------------
 * @url: tags/
 * @verb: POST
 * @request: {"name": "string"}
 * @hasaccess: SU
 */
function newTag() {
    return function (req, res) {
        Tag.CREATE(req.body)
            .then(function (tag) {
                res.json({ success: true, data: tag });
            })
            .catch(function (error) {
                res.status(error.statusCode || 400).send({ success: false, description: error });
            });
    };
}

/**
 * ------------------------------
 * @description: update Post by id
 * ------------------------------
 * @url: tags/:id
 * @verb: PUT
 * @request: {"name": "string"}
 * @hasaccess: SU
 */
function update() {
    return function (req, res) {
        Tag.GETbyId(req.params.id)
            .then(function (tag) {
                return Tag.UPDATE(tag.id, req.body);
            })
            .then(function (updated_tag) {
                res.json({ success: true, data: updated_tag });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * ------------------------------
 * @description: remove Tag from db by id
 * ------------------------------
 * @url: tags/:id
 * @verb: DELETE
 * @hasaccess: SU
 */
function remove() {
    return function (req, res) {
        Tag.GETbyId(req.params.id)
            .then(function (model) {
                return Tag.REMOVE(model.id);
            })
            .then(function () {
                res.json({ success: true, description: 'Tag #' + req.params.id + ' was removed' });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

module.exports = router;
