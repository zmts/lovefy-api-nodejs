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
        id: {type: 'integer'},
        user_id: {type: 'integer'},
        title: {type: 'string', minLength: 3, maxLength: 100},
        path: {type: 'string', minLength: 1, maxLength: 500},
        description: {type: 'string', minLength: 5, maxLength: 1000},
        private: {type: 'boolean'}, // default TRUE
        event_location: {type: 'integer'}, // tag_id
        event_date: {type: 'string', format: 'date-time'},
        created_at: {type: 'string', format: 'date-time'},
        updated_at: {type: 'string', format: 'date-time'}
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
    return PHOTO_URL + '/' + this.user_id + '/' + this.path + '/' + 'cover_thumbnail.jpg';
};
Album.prototype._cover_index = function () {
    return PHOTO_URL + '/' + this.user_id + '/' + this.path + '/' + 'cover_index.jpg';
};

Album.relationMappings = {

};

/**
 * ------------------------------
 * @HOOKS
 * ------------------------------
 */

Album.prototype.$beforeInsert = function (json) {
    // this.$validate();
};

Album.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
    this.$validate();
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
    return this.query().findById(id)
        .then(function (data) {

        })
        .catch(function (error) {

        });
};

module.exports = Album;
