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
router.post('/:id/cover/index',
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Album),
    upload.albumCover('cover_index'),
    validate.albumCover(),
    setCoverIndex()
);
router.post('/:id/cover/thumbnail',
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Album),
    upload.albumCover('cover_thumbnail'),
    validate.albumCover(),
    setCoverThumbnail()
);

/**
 * ------------------------------------------------------------
 * @RELATED_ROUTES
 * ------------------------------------------------------------
 */
router.post('/:id/upload',
    upload.photoToAlbum(),
    processOnePhotoToAlbum()
);
router.post('/:id/create-attach-tag',
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Album),
    createAndAttachTagToAlbum()
);
router.post('/:id/attach-tag/:tag_id',
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Album),
    attachTagToAlbum()
);
router.post('/:id/detach-tag/:tag_id',
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Album),
    detachTagFromAlbum()
);

/**
 * ------------------------------------------------------------
 * @BASE_ROUTES
 * ------------------------------------------------------------
 */
router.get('/',
    auth.checkToken(),
    sec.isAdmin(),
    getAll()
);
router.get('/:id',
    auth.checkToken(),
    sec.checkItemAccess.read(Album),
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
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Album),
    remove()
);

/**
 * ------------------------------------------------------------
 * @CONTROLLERS
 * ------------------------------------------------------------
 */

/**
 * @description get all Albums list
 * @url GET: albums/
 * @return ADMINROLES >> fetch all mix ALBUM's of all users
 * @return not ADMINROLES >> fetch all public ALBUM's of all users
 */
function getAll() {
    return function (req, res, next) {
        _getAllAccessSwitcher(req.body.helpData.isAdmin)
            .then(function (list) {
                res.json({ success: true, data: list });
            }).catch(next);
    };
}

/**
 * @description getAll access helper
 * @param isAdmin BOOLEAN
 */
function _getAllAccessSwitcher(isAdmin) {
    if (isAdmin) return Album.GetAll();
    return Album.GetAllPub();
}

/**
 * @description get ALBUM by id
 * @return owner, ADMINROLES >> public or private ALBUM
 * @return Anonymous, NotOwner >> only public ALBUM
 * @url GET: tags/:id
 */
function getAlbum () {
    return function (req, res, next) {
        Album.GetById(req.params.id)
            .then(function (model) {
                res.json({ success: true, data: model });
            }).catch(next);
    };
}

/**
 * @description create ALBUM
 * @url POST: albums/
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
function newAlbum() {
    return function (req, res, next) {
        delete req.body.helpData;
        Album.Create(req.body)
            .then(function (model) {
                res.status(201).json({ success: true, data: model });
            }).catch(next);
    };
}

/**
 * @description update ALBUM by id
 * @url PATCH: albums/:id
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
function update() {
    return function (req, res, next) {
        delete req.body.helpData;
        Album.UPDATE(req.params.id, req.body)
            .then(function (updated_model) {
                res.json({ success: true, data: updated_model });
            }).catch(next);
    };
}

/**
 * @description remove ALBUM entity
 * @url DELETE: albums/:id
 * @hasaccess owner, ADMINROLES
 */
function remove() {
    return function (req, res, next) {
        Album.EraseAlbum(req.params.id)
            .then(function () {
                res.json({ success: true, description: `Album #${req.params.id} was removed` });
            }).catch(next);
    };
}

/**
 * @description set cover index picture
 * @url POST: /albums/:id/cover/index?status=true
 * @url POST: /albums/:id/cover/index?status=false // to disable cover
 * @hasaccess owner, ADMINROLES
 * @return updated model
 */
function setCoverIndex() {
    return function (req, res, next) {
        Album.SetCoverIndex(req.params.id, req.query.status)
            .then(function (model) {
                res.json({ success: true, data: model });
            }).catch(next);
    };
}

/**
 * @description set cover thumbnail picture
 * @url POST: albums/:id/cover/thumbnail?status=true
 * @url POST: albums/:id/cover/thumbnail?status=false // to disable cover
 * @hasaccess owner, ADMINROLES
 * @return updated model
 */
function setCoverThumbnail() {
    return function (req, res, next) {
        Album.SetCoverThumbnail(req.params.id, req.query.status)
            .then(function (model) {
                res.json({ success: true, data: model });
            }).catch(next);
    };
}

/**
 * @description adds ONLY one image(JPG/JPEG) to ALBUM
 * @url POST: albums/:id/upload
 * @request form-data-file-field "photo"
 */
function processOnePhotoToAlbum() {
    return function (req, res, next) {
        Album.ProcessOnePhotoToAlbum(req.params.id, req.body.helpData.userIdFromAlbumModel, req.file)
            .then(function (model) {
                res.json({ success: true, data: model });
            }).catch(next);
    };
}

/**
 * @description create and attach TAG to ALBUM
 * @hasaccess OWNER, ADMINROLES
 * @url POST: albums/:id/create-attach-tag
 * @request {"name": "string"}
 */
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

/**
 * @description check TAG existing in ALBUM >> attach TAG to ALBUM
 * @hasaccess OWNER, ADMINROLES
 * @url POST: albums/:id/attach-tag/:tag_id
 */
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

/**
 * @description detach TAG from ALBUM
 * @hasaccess OWNER, ADMINROLES
 * @url POST: albums/:id/detach-tag/:tag_id
 */
function detachTagFromAlbum () {
    return function (req, res, next) {
        Album.DetachTagFromAlbum(req.params.id, req.params.tag_id)
            .then(function (tag_id) {
                res.json({ success: true, data: `Tag#${tag_id} was detached from Album#${req.params.id}` });
            }).catch(next);
    };
}

module.exports = router;
