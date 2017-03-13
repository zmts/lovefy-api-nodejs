var ROOT_DIR = require('../config/').rootDir;
var multer  = require('multer');

/**
 * ------------------------------
 * @description: upload cover image to ALBUM entity
 * ------------------------------
 * @param {String} coverType = 'cover_index' or 'cover_thumbnail'
 */
module.exports.cover = function (coverType) {
    return function (req, res, next) {

        var uploadStorage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, ROOT_DIR + '/public/tmp_uploads');
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '.jpg');
            }
        });

        var uploadOptions = {
            storage: uploadStorage,
            limits: {
                fileSize: 1024 * 1024, // max file size 1Mb
                files: 1
            },
            includeEmptyFields: false
        };

        var upload = multer(uploadOptions).single(coverType);

        upload(req, res, function (error) {
            if (error) return res.status(400).send({
                success: false,
                description: error,
                info: error.code === 'LIMIT_UNEXPECTED_FILE' ? 'Uploading field must be named as \'cover_index\' or \'cover_thumbnail\'' : ''
            });
            next();
        });
    };
};


