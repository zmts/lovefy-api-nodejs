'use strict';

var express = require('express');
var router = express.Router();

var Tag = require('../models/tag');
// var validateReq = require('../middleware/validateReq');
// var auth = require('../middleware/auth');

/**
 * BASE_URL: tags/
 */

/**
 * other routes
 */
router.get('/find',             findByString());

/**
 * related routes
 */
router.get('/:id/posts/all',    getMixPostsByTagId());
router.get('/:id/posts/public', getPublicPostsByTagId());

/**
 * base routes
 */
router.get('/all',              getAll());
router.get('/:id',              getTag());
router.post('/',                newTag());
router.put('/:id',              update());
router.delete('/:id',           remove());

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

function getMixPostsByTagId() {
    return function (req, res) {
        Tag.getMixPostsByTagId(req.params.id)
            .then(function (list) {
                res.json({success: true, data: list});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    };
}

function getPublicPostsByTagId() {
    return function (req, res) {
        Tag.getPublicPostsByTagId(req.params.id)
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
 * url: tags/all
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
