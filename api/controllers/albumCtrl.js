'use strict';

var express = require('express');
var router = express.Router();

var Album = require('../models/album');
var auth = require('../middleware/auth');
var sec = require('../middleware/security');

/**
 * ------------------------------
 * @BASE_URL: albums/
 * ------------------------------
 */

/**
 * @RELATED_ROUTES
 */

/**
 * @BASE_ROUTES
 */
router.get('/',
    getAll()
);
router.get('/:id',
    getAlbum()
);
router.post('/',
    auth.checkToken(),
    sec.checkItemAccess.create(),
    newAlbum()
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
 * @description: get all Albums list
 * ------------------------------
 * @url: albums/
 * @verb: GET
 * @return: owner, ADMINROLES >> all list
 * @return: Anonymous, NotOwner >> public list
 */
function getAll() {
    return function (req, res) {
        Album.getAll()
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
 * @description: get ALBUM by id
 * ------------------------------
 * @return owner, ADMINROLES >> public or private ALBUM
 * @return Anonymous, NotOwner >> only public ALBUM
 * @url tags/:id
 * @verb GET
 */
function getAlbum () {
    return function (req, res) {
        Album.getById(req.params.id)
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
 * @description: create ALBUM
 * ------------------------------
 * @url: albums/
 * @verb: POST
 * @request:
 * {
 * user_id: "int'
 * title: "string"
 * [description: "string"]
 * [cover_index: "string"]
 * cover_thumbnail: "string"
 * [private: "boolean"]
 * [event_location: "int"] tag_id
 * [event_date: "string"]
 * }
 * @hasaccess: EDITORROLES, ADMINROLES
 */
function newAlbum() {
    return function (req, res) {
        delete req.body.helpData;
        Album.create(req.body)
            .then(function (model) {
                res.status(201).json({success: true, data: model});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    };
}

/**
 * ------------------------------
 * @description: update ALBUM by id
 * ------------------------------
 * @url: albums/:id
 * @verb: PUT
 * @request:
 * @hasaccess: owner, ADMINROLES
 */
function update() {
    return function (req, res) {
        Album.getById(req.params.id)
            .then(function (model) {
                return Album.update(model.id, req.body);
            })
            .then(function (updated_model) {
                res.json({success: true, data: updated_model});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    };
}

/**
 * ------------------------------
 * @description: remove ALBUM from db by id
 * ------------------------------
 * @url: albums/:id
 * @verb: DELETE
 * @hasaccess: owner, ADMINROLES
 */
function remove() {
    return function (req, res) {
        Album.getById(req.params.id)
            .then(function (model) {
                return Album.remove(model.id);
            })
            .then(function () {
                res.json({success: true, description: 'Album #' + req.params.id + ' was removed'});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error});
            });
    };
}

module.exports = router;
