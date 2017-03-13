const _ = require('lodash');

module.exports.id = function () {
    return function (req, res, next) {
        if ( _.isNaN(+req.params.id) ) {
            return res.status(400).send({
                success: false,
                description: 'Invalid request param id >> ' + req.params.id
            });
        }
        next();
    };
};

/**
 * ------------------------------
 * @description: validate image type for cover uploading
 * acceptable only JPEG
 * ------------------------------
 */
module.exports.coverImage = function () {
    return function (req, res, next) {
        if (req.file.mimetype !== 'image/jpeg') {
            return res.status(400).send({
                success: false,
                description: 'File must be .jpg'
            });
        }
        next();
    };
};
