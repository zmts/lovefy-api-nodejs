'use strict';

const fsp = require('fs-promise');

const MainModel = require('./main');
const PHOTO_DIR = require('../config/').photoDir;

function Photo() {
    MainModel.apply(this, arguments);
}

Photo.tableName = 'photos';
MainModel.extend(Photo);

Photo.jsonSchema = {
    type: 'object',
    required: ['filename', 'user_id', 'album_id'],
    additionalProperties: false,
    properties: {
        id: { type: 'integer' },
        filename: { type: 'string' },
        user_id: { type: 'integer' },
        album_id: { type: 'integer' },
        views: { type: 'integer' },
        best: { type: 'boolean' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
    }
};

/**
 * ------------------------------
 * @VIRTUAL_ATTRIBUTES
 * ------------------------------
 */
Photo.virtualAttributes = [
    '_src',
    '_thumbnail_mid',
    '_thumbnail_low'
];

Photo.prototype._src = function () {
    return `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/photos/uid-${this.user_id}/${this.album_id}/src/${this.filename}`;
};

Photo.prototype._thumbnail_mid = function () {
    return `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/photos/uid-${this.user_id}/${this.album_id}/thumbnail-mid/${this.filename}`;
};

Photo.prototype._thumbnail_low = function () {
    return `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/photos/uid-${this.user_id}/${this.album_id}/thumbnail-low/${this.filename}`;
};

/**
 * ------------------------------
 * @HOOKS
 * ------------------------------
 */

Photo.prototype.$beforeInsert = function (/*json*/) {
    // this.$validate();
};

Photo.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
    // this.$validate();
};

/**
 * ------------------------------
 * @METHODS
 * ------------------------------
 */

/**
 * @description get Photo by Id and Update views counter
 * @param id
 * @return updated model
 */
Photo.getByIdAndIncrementViews = function (id) {
    let that = this;

    return this.getById(id)
        .then(function (model) {
            return that.update(id, { views: model.views + 1 });
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * @description set "best" status to TRUE/FALSE
 * @param id
 * @param status TRUE/FALSE
 * @return updated model
 */
Photo.setBestStatus = function (id, status) {
    let that = this;

    if (!status) return Promise.reject('>>> \'status\' <<< field in query not defined');
    return this.getById(id)
        .then(function () {
            return that.update(id, { best: JSON.parse(status) });
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * @description erase images(src and thumbnails) from FS >> removes PHOTO model from DB
 * @param photo_id
 * @return success status
 */
Photo.erasePhoto = function (photo_id) {
    let that = this;

    return this.getById(photo_id)
        .then(function (photo) {
            return Promise.all([
                fsp.remove(`${PHOTO_DIR}/uid-${photo.user_id}/${photo.album_id}/src/${photo.filename}`),
                fsp.remove(`${PHOTO_DIR}/uid-${photo.user_id}/${photo.album_id}/thumbnail-mid/${photo.filename}`),
                fsp.remove(`${PHOTO_DIR}/uid-${photo.user_id}/${photo.album_id}/thumbnail-low/${photo.filename}`)
            ]);
        })
        .then(function () {
            return that.remove(photo_id);
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

module.exports = Photo;
