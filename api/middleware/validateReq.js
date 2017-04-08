const Joi = require('joi');
const celebrate = require('celebrate');

/**
 * @description validate params IDs via Joi schema
 */
module.exports.id = function () {
    return celebrate({
        params: Joi.object().keys({
            id: Joi.number().integer(),
            tag_id: Joi.number().integer(),
            post_id: Joi.number().integer(),
            album_id: Joi.number().integer()
        })
    });
};

/**
 * @description validate response body via Joi schema
 * @param schema
 */
module.exports.body = function (schema) {
    return celebrate(schema);
};

/**
 * ------------------------------
 * @description: validate image type for cover uploading
 * acceptable only JPEG
 * ------------------------------
 */
module.exports.albumCover = function () {
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
