'use strict';

const express = require('express');
const router = express.Router();

const Photo = require('../models/photo');
const auth = require('../middleware/auth');
const sec = require('../middleware/security');

/**
 * ------------------------------------------------------------
 * @BASE_URL: photos/
 * ------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------
 * @OTHER_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description set "best" status to TRUE/FALSE
 * @url GET: photos/:id/set-best?status=true
 * @url GET: photos/:id/set-best?status=false
 */
router.post('/:id/set-best',
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Photo),
    setBestStatus()
);

/**
 * ------------------------------------------------------------
 * @BASE_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description get PHOTO by id
 * @hasaccess All
 */
router.get('/:id',
    getPhoto()
);

/**
 * @description remove PHOTO From ALBUM
 * @hasaccess OWNER, ADMINROLES
 * @return success status
 */
router.delete('/:id',
    auth.checkToken(),
    sec.checkItemAccess.tokenUIDisEqualsModelUID(Photo),
    removePhotoFromAlbum()
);

/**
 * ------------------------------------------------------------
 * @CONTROLLERS
 * ------------------------------------------------------------
 */

function getPhoto () {
    return function (req, res) {
        Photo.getByIdAndIncrementViews(req.params.id)
            .then(function (model) {
                res.json({ success: true, data: model });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

function setBestStatus() {
    return function (req, res) {
        Photo.setBestStatus(req.params.id, req.query.status)
            .then(function (model) {
                res.json({ success: true, data: model });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

function removePhotoFromAlbum() {
    return function (req, res) {
        Photo.erasePhoto(req.params.id)
            .then(function () {
                res.json({ success: true, description: 'Photo #' + req.params.id + ' was removed' });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

module.exports = router;
