'use strict';

var fsp = require('fs-promise');
var moment = require('moment');
// var _ = require('lodash');
var Promise = require('bluebird');

var MainModel = require('./main');
var PHOTO_DIR = require('../config/').files.photo.localpath;
var PHOTO_URL = require('../config/').files.photo.globalpath;

function Album() {
    MainModel.apply(this, arguments);
}

Album.tableName = 'albums';
MainModel.extend(Album);

/**
 * ------------------------------
 * @VALIDATION_SCHEMA
 * ------------------------------
 */
Album.jsonSchema = {
    type: 'object',
    required: ['user_id', 'path'],
    additionalProperties: false,
    properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        title: { type: 'string', minLength: 3, maxLength: 100 },
        path: { type: 'string', minLength: 1, maxLength: 500 },
        description: { type: 'string', minLength: 5, maxLength: 1000 },
        private: { type: 'boolean' }, // default TRUE
        event_location: { type: 'integer' }, // tag_id
        event_date: { type: 'string', format: 'date-time' },
        cover_index: { type: 'boolean' },
        cover_thumbnail: { type: 'boolean' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
    }
};

/**
 * ------------------------------
 * @VIRTUAL_ATTRIBUTES
 * ------------------------------
 */
Album.virtualAttributes = [
    '_cover_thumbnail',
    '_cover_index'
];

Album.prototype._cover_thumbnail = function () {
    if (this.cover_thumbnail) {
        return PHOTO_URL + '/' + this.user_id + '/' + this.path + '/' + 'cover_thumbnail.jpg';
    }
    return null;
};

Album.prototype._cover_index = function () {
    if (this.cover_index) {
        return PHOTO_URL + '/' + this.user_id + '/' + this.path + '/' + 'cover_index.jpg';
    }
    return null;
};

Album.relationMappings = {

};

/**
 * ------------------------------
 * @HOOKS
 * ------------------------------
 */

Album.prototype.$formatJson = function (json) {
    json = MainModel.prototype.$formatJson.call(this, json);
    delete json.cover_index;
    delete json.cover_thumbnail;
    return json;
};

Album.prototype.$beforeInsert = function (json) {
    // this.$validate();
};

Album.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
    // this.$validate();
};

/**
 * ------------------------------
 * @METHODS
 * ------------------------------
 */

/**
 * ------------------------------
 * @description ensure/create 'user-id-photo' folder >> create ALBUM model
 * ------------------------------
 * @param data
 */
Album.create = function (data) {
    var that = this;
    var albumDirDate = moment().format('YYYYMMDD-HHmmss-x');
    var uid = '/uid-' + data.user_id + '/';

    return fsp.stat(PHOTO_DIR) // check root dir accessibility
        .then(function () {
            return Promise.all([ // ensure folders
                fsp.ensureDir(PHOTO_DIR + uid),
                fsp.ensureDir(PHOTO_DIR + uid + albumDirDate),
                fsp.ensureDir(PHOTO_DIR + uid + albumDirDate + '/src'),
                fsp.ensureDir(PHOTO_DIR + uid + albumDirDate + '/thumbnail-mid'),
                fsp.ensureDir(PHOTO_DIR + uid + albumDirDate + '/thumbnail-low')
            ]);
        })
        .then(function () {
            data.path = albumDirDate;
            return that.query().insert(data);
        })
        .catch(function (error) {
            // if error and "albumDirDate" exist TODO: delete "albumDirDate"
            throw error.message;
        });
};

Album.getById = function (id) {
    return this.query()
        .findById(id)
        .then(function (data) {
            if (!data) throw { message: 'Empty response' };
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * ------------------------------
 * @description
 * 1) place image in "PHOTO_DIR + uid + albumDirDate" folder
 * 2) rename image file to "cover_index.jpg"
 * 3) set in DB "cover_index" field to TRUE
 * ------------------------------
 * @param album_id
 * @param img
 */
Album.setCoverIndex = function (album_id, img) {
    var that = this;

    return this.getById(album_id)
        .then(function (model) {
            var data = { cover_index: true };
            return that.query().patchAndFetchById(model.id, data);
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * ------------------------------
 * @description
 * 1) place image in "PHOTO_DIR + uid + albumDirDate" folder
 * 2) rename image file to "cover_thumbnail.jpg"
 * 3) set in DB "cover_thumbnail" field to TRUE
 * ------------------------------
 * @param album_id
 * @param img
 */
Album.setCoverThumbnail = function (album_id, img) {

};

module.exports = Album;
