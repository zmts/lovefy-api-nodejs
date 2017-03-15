const moment = require('moment');

const ROOT_DIR = require('../config/').rootDir;
const multer  = require('multer');
const Album = require('../models/album');

/**
 * ------------------------------
 * @description: upload cover image to ALBUM model
 * ------------------------------
 * @param {String} coverType = 'cover_index'||'cover_thumbnail'
 */
module.exports.albumCover = function (coverType) {
    return function (req, res, next) {
        Album.getById(req.params.id)
            .then(function (model) {

                let uploadStorage = multer.diskStorage({
                    destination: function (req, file, cb) {
                        // place image to current MODEL folder
                        cb(null, `${ROOT_DIR}/public/photos/uid-${model.user_id}/${model.id}`);
                    },
                    filename: function (req, file, cb) {
                        cb(null, file.fieldname + '.jpg');
                    }
                });

                let uploadOptions = {
                    storage: uploadStorage,
                    limits: {
                        fileSize: 1024 * 1024, // max file size 1Mb
                        files: 1
                    },
                    includeEmptyFields: false
                };

                let upload = multer(uploadOptions).single(coverType);

                upload(req, res, function (error) {
                    if (error) return res.status(400).send({
                        success: false,
                        description: error,
                        info: error.code === 'LIMIT_UNEXPECTED_FILE' ? `Uploading field must be named as '${coverType}'` : undefined
                    });
                    next();
                });
            })
            .catch(function (error) {
                res.status(404).send({ success: false, description: error });
            });
    };
};

module.exports.photoToAlbum = function () {
    return function (req, res, next) {
        Album.getById(req.params.id)
            .then(function (model) {
                let photoCounter = 0;

                let uploadStorage = multer.diskStorage({
                    destination: function (req, file, cb) {
                        // place images to 'public/photos/uid-user_id/album_id/src' folder
                        // then in ALBUM model >> make models for each PHOTO and make thumbnails
                        let user_id = model.user_id;
                        let album_id = model.id;
                        cb(null, `${ROOT_DIR}/public/photos/uid-${user_id}/${album_id}/src`);
                    },
                    filename: function (req, file, cb) {
                        // rename files with 'Unix ms timestamp' + 'file number counter'
                        cb(null, `${moment().format('x')}-${photoCounter++}.jpg`);
                    }
                });

                let uploadOptions = {
                    storage: uploadStorage,
                    limits: {
                        fileSize: 1024 * 1024 * 2, // max file size 2Mb
                        files: 500 // max 500 files
                    },
                    includeEmptyFields: false
                };

                let upload = multer(uploadOptions).array('photos');

                upload(req, res, function (error) {
                    if (error) return res.status(400).send({
                        success: false,
                        description: error,
                        info: error.code === 'LIMIT_UNEXPECTED_FILE' ? 'Uploading field must be named as \'photos\'' : undefined
                    });
                    next();
                });
            })
            .catch(function (error) {
                res.status(404).send({ success: false, description: error });
            });
    };
};


