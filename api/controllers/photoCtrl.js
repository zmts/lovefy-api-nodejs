'use strict';

const express = require('express');
const router = express.Router();

const Photo = require('../models/photo');
// const auth = require('../middleware/auth');
// const sec = require('../middleware/security');

/**
 * ------------------------------
 * @BASE_URL: photos/
 * ------------------------------
 */

/**
 * @BASE_ROUTES
 */
router.get('/:id',
    getPhoto()
);

module.exports = router;

/**
 * ------------------------------
 * @CONTROLLERS
 * ------------------------------
 */

/**
 * @description: get PHOTO by id
 * @hasaccess: All
 * @url GET: photos/:id
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
