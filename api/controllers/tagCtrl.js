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
    sec.isLogin(),
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
    sec.checkAdminRoleAccess(),
    newTag()
);
router.patch('/:id',
    auth.checkToken(),
    sec.checkAdminRoleAccess(),
    update()
);
router.delete('/:id',
    auth.checkToken(),
    sec.checkAdminRoleAccess(),
    remove()
);

/**
 * @description find tag by substring
 * @url GET: tags/find?q=sometagname
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
 * @description get Tag by id
 * @hasaccess All
 * @url GET: tags/:id
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
 * @description get Posts by tag id
 *
 * @url GET: tags/:id/posts
 * @hasaccess Owner of POST model >> response with own POST's list and other USERS public POST's
 * @hasaccess ADMINROLES >> response All mixed POSTS of all USER's
 * @hasaccess Anonymous, NotOwner >> response only with public POSTS of all USER's
 *
 * @url GET: tags/:id/posts?own=true
 * @hasaccess Owner of POST model >> response only with own POST's list
 * @hasaccess ADMINROLES >> response only with own POST's list
 * @hasaccess Anonymous, NotOwner >> response only with public POSTS of all USER's
 */
function getPostsByTagId () {
    return function (req, res) {
        let requestOptions = {
            userId: req.body.helpData.userId,
            tagId: req.params.id,
            isOwn: req.query.own ? JSON.parse(req.query.own) : false,
            isAdmin: req.body.helpData.isAdmin
        };

        Tag.getPostsByTagIdAccessSwitcher(requestOptions)
            .then(function (list) {
                res.json({ success: true, data: list });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * @description get all Tags list
 * @url GET: tags/
 * @hasaccess All
 */
function getAll() {
    return function (req, res) {
        Tag.GETall()
            .then(function (list) {
                res.json({ success: true, data: list });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * @description create Tag
 * @url POST: tags/
 * @request {"name": "string"}
 * @hasaccess ADMINROLES
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
 * @description update Tag by id
 * @url PATCH: tags/:id
 * @request {"name": "string"}
 * @hasaccess ADMINROLES
 */
function update() {
    return function (req, res) {
        delete req.body.helpData;
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
 * @description remove Tag from db by id
 * @url: DELETE: tags/:id
 * @hasaccess ADMINROLES
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
