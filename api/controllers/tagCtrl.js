'use strict';

var express = require('express');
var router = express.Router();

var Tag = require('../models/tag');
var auth = require('../middleware/auth');
var sec = require('../middleware/security');

/**
 * ------------------------------
 * BASE_URL: tags/
 * ------------------------------
 */

/**
 * other routes
 */
router.get('/find',
    findByString()
);

/**
 * related routes
 */
router.get('/:id/posts',
    auth.checkToken(),
    sec.checkOwner(),
    getPostsByTagId()
);

/**
 * base routes
 */
router.get('/',
    getAll()
);
router.get('/:id',
    getTag()
);
router.post('/',
    newTag()
);
router.put('/:id',
    update()
);
router.delete('/:id',
    remove()
);


/**
 * ------------------------------
 * description: get Tag by id
 * ------------------------------
 * access: All
 * url: tags/:id
 * method: GET
 */
function getTag () {
    return function (req, res) {
        Tag.getById(req.params.id)
            .then(function (model) {
                res.json({success: true, data: model});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    };
}

/**
 * ------------------------------
 * description: get Posts by tag id
 * url: tags/:id/posts
 * method: GET
 *
 * if User is Public >>
 * - endpoint must response only with public posts list
 *
 * if User is Owner of Post model >>
 * - endpoint must response with full list of User posts
 * - and with list of other Users public Posts
 * ------------------------------
 */
function getPostsByTagId () {
    return function (req, res) {
        Tag.getById(req.params.id)
            .then(function (tag) {
                if ( req.body.helpData.userId ) {
                    return Tag.getMixPostsByTagId(req.body.helpData.userId, tag.id);
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
 * description: get all Tags
 * ------------------------------
 * url: tags/
 * method: GET
 */
function getAll() {
    return function (req, res) {
        Tag.getAll()
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
 * description: create Tag
 * ------------------------------
 * url: tags/
 * method: POST
 * request: {"name": "string"}
 */
function newTag() {
    return function (req, res) {
        Tag.create(req.body)
            .then(function (tag) {
                res.json({success: true, data: tag});
            })
            .catch(function (error) {
                res.status(error.statusCode || 400).send({success: false, description: error});
            });
    };
}

/**
 * ------------------------------
 * description: find tag by substring
 * ------------------------------
 * url: tags/find?q=sometagname
 * method: GET
 */
function findByString() {
    return function (req, res) {
        Tag.findByString(req.query.q)
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
 * description: update Post by id
 * ------------------------------
 * url: tags/:id
 * method: PUT
 * request: {"name": "string"}
 */
function update() {
    return function (req, res) {
        Tag.getById(req.params.id)
            .then(function (tag) {
                return Tag.update(tag.id, req.body);
            })
            .then(function (updated_tag) {
                res.json({success: true, data: updated_tag});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    };
}

/**
 * ------------------------------
 * description: remove Tag from db by id
 * ------------------------------
 * url: tags/:id
 * method: DELETE
 */
function remove() {
    return function (req, res) {
        Tag.getById(req.params.id)
            .then(function (model) {
                return Tag.remove(model.id);
            })
            .then(function () {
                res.json({success: true, description: 'Tag #' + req.params.id + ' was removed'});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    };
}

module.exports = router;
