'use strict';

const express = require('express');
const router = express.Router();

const Album = require('../models/album');
const Photo = require('../models/photo');
const auth = require('../middleware/auth');
const sec = require('../middleware/security');
const upload = require('../middleware/upload');
const validate = require('../middleware/validateReq');

/**
 * ------------------------------
 * @BASE_URL: albums/
 * ------------------------------
 */

/**
 * ------------------------------
 * @OTHER_ROUTES
 * ------------------------------
 */
router.post('/:id/cover/index',
    auth.checkToken(),
    sec.checkItemAccess.setAlbumCover(Album),
    upload.albumCover('cover_index'),
    validate.albumCover(),
    setCoverIndex()
);
router.post('/:id/cover/thumbnail',
    auth.checkToken(),
    sec.checkItemAccess.setAlbumCover(Album),
    upload.albumCover('cover_thumbnail'),
    validate.albumCover(),
    setCoverThumbnail()
);

/**
 * ------------------------------
 * @RELATED_ROUTES
 * ------------------------------
 */
router.post('/:id/upload',
    upload.photoToAlbum(),
    processOnePhotoToAlbum()
);
router.post('/:id/remove-photo/:photo_id',
    removePhotoFromAlbum()
);

/**
 * ------------------------------
 * @BASE_ROUTES
 * ------------------------------
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
router.patch('/:id',
    auth.checkToken(),
    sec.checkItemAccess.update(Album),
    update()
);
router.delete('/:id',
    auth.checkToken(),
    sec.checkSUAccess(),
    remove()
);

module.exports = router;

/**
 * ------------------------------
 * @CONTROLLERS
 * ------------------------------
 */

/**
 * @description: get all Albums list
 * @url: GET: albums/
 * @return: owner, ADMINROLES >> all list
 * @return: Anonymous, NotOwner >> public list
 */
function getAll() {
    return function (req, res) {
        Album.getAllPub()
            .then(function (list) {
                res.json({ success: true, data: list });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * @description: get ALBUM by id
 * @return owner, ADMINROLES >> public or private ALBUM
 * @return Anonymous, NotOwner >> only public ALBUM
 * @url GET: tags/:id
 */
function getAlbum () {
    return function (req, res) {
        Album.getById(req.params.id)
            .then(function (model) {
                res.json({ success: true, data: model });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * @description: create ALBUM
 * @url: POST: albums/
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
                res.status(201).json({ success: true, data: model });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * @description: update ALBUM by id
 * @url: PUT: albums/:id
 * @request:
 * @hasaccess: owner, ADMINROLES
 */
function update() {
    return function (req, res) {
        delete req.body.helpData;
        Album.getById(req.params.id)
            .then(function (model) {
                return Album.update(model.id, req.body);
            })
            .then(function (updated_model) {
                res.json({ success: true, data: updated_model });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * @description: remove ALBUM from db by id
 * @url: DELETE: albums/:id
 * @hasaccess: owner, ADMINROLES
 */
function remove() {
    return function (req, res) {
        Album.getById(req.params.id)
            .then(function (model) {
                return Album.remove(model.id);
            })
            .then(function () {
                res.json({ success: true, description: `Album #${req.params.id} was removed` });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * @description: set cover index picture
 * @url: POST: /albums/:id/cover/index?status=true
 * @url: POST: /albums/:id/cover/index?status=false // to disable cover
 * @hasaccess: owner, ADMINROLES
 * @return updated model
 */
function setCoverIndex() {
    return function (req, res) {
        Album.setCoverIndex(req.params.id, req.query.status)
            .then(function (model) {
                res.json({ success: true, data: model });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * @description: set cover thumbnail picture
 * @url: POST: albums/:id/cover/thumbnail?status=true
 * @url: POST: albums/:id/cover/thumbnail?status=false // to disable cover
 * @hasaccess: owner, ADMINROLES
 * @return updated model
 */
function setCoverThumbnail() {
    return function (req, res) {
        Album.setCoverThumbnail(req.params.id, req.query.status)
            .then(function (model) {
                res.json({ success: true, data: model });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * @description: adds ONLY one image(JPG/JPEG) to ALBUM
 * @url: POST: albums/:id/upload
 * @request: form-data-file-field "photo"
 */
function processOnePhotoToAlbum() {
    return function (req, res) {
        Album.processOnePhotoToAlbum(req.params.id, req.body.helpData.userIdFromAlbumModel, req.file)
            .then(function (model) {
                res.json({ success: true, data: model });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * @description remove PHOTO From ALBUM
 * @url POST: albums/:id/remove-photo/:photo_id
 */
function removePhotoFromAlbum() {
    return function (req, res) {
        Photo.getById(req.params.photo_id)
            .then(function (model) {
                return Photo.remove(model.id);
            })
            .then(function () {
                res.json({ success: true, description: 'Photo #' + req.params.id + ' was removed' });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}
