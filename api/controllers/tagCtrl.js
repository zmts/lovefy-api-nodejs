'use strict';

var express = require('express');
var router = express.Router();

var Tag = require('../models/tag');
var auth = require('../middleware/auth');


/**
 * baseUrl: tags/
 */

/**
 * related routes
 */

/**
 * base routes
 */

router.get('/all',              getAll());
router.get('/:id',              getTagById());

router.post('/',                newTag());
router.put('/:id',              update());
router.delete('/:id',           remove());


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
                res.status(404).send({success: false, description: error});
            });
    }
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
                res.status(400).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: get Tag by id
 * ------------------------------
 * url: tags/:id
 * method: GET
 */
function getTagById() {
    return function (req, res) {
        Tag.getById(req.params.id)
            .then(function (post) {
                res.json({success: true, data: post})
            })
            .catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
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
                res.status(404).send({success: false, description: error});
            });
    }
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
                res.status(404).send({success: false, description: error});
            });
    }
}

module.exports = router;
