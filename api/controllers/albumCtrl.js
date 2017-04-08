'use strict';

const express = require('express');
const router = express.Router();

const Album = require('../models/album');
const Tag = require('../models/tag');
const auth = require('../middleware/auth');
const sec = require('../middleware/security');
const upload = require('../middleware/upload');
const validate = require('../middleware/validateReq');

/**
 * ------------------------------------------------------------
 * @BASE_URL: albums/
 * ------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------
 * @OTHER_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description set cover index picture
 * @url albums/:id/cover/index?status=true
 * @url albums/:id/cover/index?status=false // to disable cover
 * @hasaccess owner, ADMINROLES
 * @return updated model
 */
router.post('/:id/cover/index',
    validate.id(),
    validate.query(Album.rules.SetCover),
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Album),
    upload.albumCover('cover_index'),
    setCoverIndex()
);

/**
 * @description set cover thumbnail picture
 * @url albums/:id/cover/thumbnail?status=true
 * @url albums/:id/cover/thumbnail?status=false // to disable cover
 * @hasaccess owner, ADMINROLES
 * @return updated model
 */
router.post('/:id/cover/thumbnail',
    validate.id(),
    validate.query(Album.rules.SetCover),
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Album),
    upload.albumCover('cover_thumbnail'),
    setCoverThumbnail()
);

/**
 * ------------------------------------------------------------
 * @RELATED_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description adds ONLY one image(JPG/JPEG) to ALBUM
 * @request form-data-file-field "photo"
 */
router.post('/:id/upload',
    validate.id(),
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Album),
    upload.photoToAlbum(),
    processOnePhotoToAlbum()
);

/**
 * @description create and attach TAG to ALBUM
 * @hasaccess OWNER, ADMINROLES
 * @request {"name": "string"}
 */
router.post('/:id/create-attach-tag',
    validate.id(),
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Album),
    createAndAttachTagToAlbum()
);

/**
 * @description check TAG existing in ALBUM >> attach TAG to ALBUM
 * @hasaccess OWNER, ADMINROLES
 */
router.post('/:id/attach-tag/:tag_id',
    validate.id(),
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Album),
    attachTagToAlbum()
);

/**
 * @description detach TAG from ALBUM
 * @hasaccess OWNER, ADMINROLES
 */
router.post('/:id/detach-tag/:tag_id',
    validate.id(),
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Album),
    detachTagFromAlbum()
);

/**
 * ------------------------------------------------------------
 * @BASE_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @url albums?page=0
 * @return ADMINROLES >> fetch all mix ALBUM's of all users
 * @return not ADMINROLES >> fetch all public ALBUM's of all users
 */
router.get('/',
    auth.checkToken(),
    sec.isAdmin(),
    getAll()
);

/**
 * @return last public added ALBUM model
 */
router.get('/last',
    getLastAlbum()
);

/**
 * @description get ALBUM by id
 * @return owner, ADMINROLES >> public or private ALBUM
 * @return Anonymous, NotOwner >> only public ALBUM
 */
router.get('/:id',
    validate.id(),
    auth.checkToken(),
    sec.checkItemAccess.read(Album),
    getAlbum()
);

/**
 * @description create ALBUM
 * @request
 * {
 * title: "string"
 * [description: "string"]
 * [cover_index: "string"]
 * cover_thumbnail: "string"
 * [private: "boolean"]
 * [event_location: "int"] tag_id
 * [event_date: "string"]
 * }
 * @hasaccess EDITORROLES, ADMINROLES
 */
router.post('/',
    validate.body(Album.rules.CreateUpdate),
    auth.checkToken(),
    sec.checkItemAccess.create(),
    newAlbum()
);

/**
 * @description update ALBUM by id
 * @request
 * {
 * title: "string"
 * [description: "string"]
 * [cover_index: "string"]
 * cover_thumbnail: "string"
 * [private: "boolean"]
 * [event_location: "int"] tag_id
 * [event_date: "string"]
 * }
 * @hasaccess OWNER, ADMINROLES
 */
router.patch('/:id',
    validate.id(),
    validate.body(Album.rules.CreateUpdate),
    auth.checkToken(),
    sec.checkItemAccess.update(Album),
    update()
);


/**
 * @description remove ALBUM entity
 * @hasaccess owner, ADMINROLES
 */
router.delete('/:id',
    validate.id(),
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Album),
    remove()
);

/**
 * ------------------------------------------------------------
 * @CONTROLLERS
 * ------------------------------------------------------------
 */

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
    if (isAdmin) return Album.GetMixList(queryPage);
    return Album.GetPubList(queryPage);
}

function getAlbum () {
    return function (req, res, next) {
        Album.GetById(req.params.id)
            .then(function (model) {
                res.json({ success: true, data: model });
            }).catch(next);
    };
}

function newAlbum() {
    return function (req, res, next) {
        delete req.body.helpData;
        Album.Create(req.body)
            .then(function (model) {
                res.status(201).json({ success: true, data: model });
            }).catch(next);
    };
}

function update() {
    return function (req, res, next) {
        delete req.body.helpData;
        Album.UPDATE(req.params.id, req.body)
            .then(function (updated_model) {
                res.json({ success: true, data: updated_model });
            }).catch(next);
    };
}

function remove() {
    return function (req, res, next) {
        Album.EraseAlbum(req.params.id)
            .then(function () {
                res.json({ success: true, description: `Album #${req.params.id} was removed` });
            }).catch(next);
    };
}

function setCoverIndex() {
    return function (req, res, next) {
        Album.SetCoverIndex(req.params.id, req.query.status)
            .then(function (model) {
                res.json({ success: true, data: model });
            }).catch(next);
    };
}

function setCoverThumbnail() {
    return function (req, res, next) {
        Album.SetCoverThumbnail(req.params.id, req.query.status)
            .then(function (model) {
                res.json({ success: true, data: model });
            }).catch(next);
    };
}

function processOnePhotoToAlbum() {
    return function (req, res, next) {
        Album.ProcessOnePhotoToAlbum(req.params.id, req.body.helpData.userIdFromAlbumModel, req.file)
            .then(function (model) {
                res.json({ success: true, data: model });
            }).catch(next);
    };
}

function createAndAttachTagToAlbum() {
    return function (req, res, next) {
        delete req.body.helpData;
        Tag.CREATE(req.body)
            .then(function (tag) {
                return Album.AttachTagToAlbum(req.params.id, tag.id);
            })
            .then(function (tag_id) {
                res.status(201).json({ success: true, data: `Tag#${tag_id} was created and attached to ${req.params.id}` });
            }).catch(next);
    };
}

function attachTagToAlbum() {
    return function (req, res, next) {
        Album.CheckTagByIdInAlbum(req.params.id, req.params.tag_id)
            .then(function () {
                return Album.AttachTagToAlbum(req.params.id, req.params.tag_id);
            })
            .then(function (tag_id) {
                res.json({ success: true, data: `Tag#${tag_id} was attached to Album#${req.params.id}` });
            }).catch(next);
    };
}

function detachTagFromAlbum () {
    return function (req, res, next) {
        Album.DetachTagFromAlbum(req.params.id, req.params.tag_id)
            .then(function (tag_id) {
                res.json({ success: true, data: `Tag#${tag_id} was detached from Album#${req.params.id}` });
            }).catch(next);
    };
}

function getLastAlbum() {
    return function (req, res, next) {
        Album.GetLastAlbum()
            .then(function (model) {
                res.json({ success: true, data: model });
            }).catch(next);
    };
}

module.exports = router;
