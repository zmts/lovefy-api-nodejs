const PHOTO_DIR = require('../config/').photoDir;
const multer = require('multer');
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
                        cb(null, `${PHOTO_DIR}/uid-${model.user_id}/${model.id}`);
                    },
                    filename: function (req, file, cb) {
                        cb(null, file.fieldname + '.jpg');
                    }
                });

                let maxFileSize = 1024 * 1024; // max file size 1Mb

                let uploadOptions = {
                    storage: uploadStorage,
                    limits: {
                        fileSize: maxFileSize,
                        files: 1,
                        fields: 0 // denny non file-type fields
                    },
                    includeEmptyFields: false,
                    fileFilter: function (req, file, cb) {
                        if (file.mimetype !== 'image/jpeg') {
                            return cb('Unsupported Media Type. Only [\'.jpg\',\'.jpeg\'] files are allowed!', false);
                        }
                        return cb(null, true);
                    }
                };

                let upload = multer(uploadOptions).single(coverType);

                upload(req, res, function (error) {

                    if (error) {

                        let errorInfoMessage = 'Upload error';

                        switch (error.code) {
                            case 'LIMIT_FILE_SIZE':
                                errorInfoMessage = `Max file size ${maxFileSize / 1024 / 1024}Mb`;
                                break;
                            case 'LIMIT_UNEXPECTED_FILE':
                                errorInfoMessage = `Uploading field must be named as >>> '${coverType}' <<<`;
                                break;
                            default:
                                errorInfoMessage = undefined;
                                break;
                        }

                        return res.status(400).send({
                            success: false,
                            description: error.message || error,
                            info: errorInfoMessage
                        });
                    }

                    next();
                });
            })
            .catch(function (error) {
                res.status(404).send({ success: false, description: error });
            });
    };
};

/**
 * ------------------------------
 * @description: upload ONE PHOTO to ALBUM model
 * ------------------------------
 */
module.exports.photoToAlbum = function () {
    return function (req, res, next) {
        Album.getById(req.params.id)
            .then(function (model) {

                let uploadStorage = multer.diskStorage({
                    destination: function (req, file, cb) {
                        // place image to 'public/photos/uid-user_id/album_id/src' folder
                        // then in ALBUM model >> create PHOTO model and make thumbnail
                        let user_id = model.user_id;
                        let album_id = model.id;
                        cb(null, `${PHOTO_DIR}/uid-${user_id}/${album_id}/src`);
                    },
                    filename: function (req, file, cb) {
                        // rename files with 'Unix ms timestamp'
                        cb(null, `${Date.now()}.jpg`);
                    }
                });

                let maxFileSize = 1024 * 1024 * 2; // max file size 2Mb

                let uploadOptions = {
                    storage: uploadStorage,
                    limits: {
                        fileSize: maxFileSize,
                        files: 1, // max 1 file
                        fields: 0 // denny non file-type fields
                    },
                    includeEmptyFields: false,
                    fileFilter: function (req, file, cb) {
                        if (file.mimetype !== 'image/jpeg') {
                            return cb('Unsupported Media Type. Only [\'.jpg\',\'.jpeg\'] files are allowed!', false);
                        }
                        return cb(null, true);
                    }
                };

                let upload = multer(uploadOptions).single('photo');

                upload(req, res, function (error) {

                    if (error) {

                        let errorInfoMessage = 'Upload error';

                        switch (error.code) {
                            case 'LIMIT_FILE_SIZE':
                                errorInfoMessage = `Max file size ${maxFileSize / 1024 / 1024}Mb`;
                                break;
                            case 'LIMIT_UNEXPECTED_FILE':
                                errorInfoMessage = 'Uploading field must be named as >>> \'photo\' <<<';
                                break;
                            default:
                                errorInfoMessage = undefined;
                                break;
                        }

                        return res.status(400).send({
                            success: false,
                            description: error.message || error,
                            info: errorInfoMessage
                        });
                    }

                    req.body = {
                        helpData: { userIdFromAlbumModel: model.user_id }
                    };

                    next();
                });
            })
            .catch(function (error) {
                res.status(404).send({ success: false, description: error });
            });
    };
};


