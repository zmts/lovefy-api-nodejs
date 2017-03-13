const ROOT_DIR = require('../config/').rootDir;
const multer  = require('multer');
const Album = require('../models/album');

/**
 * ------------------------------
 * @description: upload cover image to ALBUM model
 * ------------------------------
 * @param {String} coverType = 'cover_index'||'cover_thumbnail'
 */
module.exports.coverImage = function (coverType) {
    return function (req, res, next) {
        Album.getById(req.params.id)
            .then(function (model) {

                let uploadStorage = multer.diskStorage({
                    destination: function (req, file, cb) {
                        cb(null, `${ROOT_DIR}/public/photos/uid-${model.user_id}/${model.path}`);
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


