'use strict';

var mz =require('mz/fs'); // promisificated fs
var fsp = require('fs-promise'); // extended promisificated fs
var moment = require('moment');
// var _ = require('lodash');
// var Promise = require('bluebird');

var MainModel = require('./main');
var PHOTOS_FOLDER = require('../config/').folders.photos;

function Album() {
    MainModel.apply(this, arguments);
}

Album.tableName = 'albums';
MainModel.extend(Album);

Album.jsonSchema = {
    type: 'object',
    required: ['user_id', 'title' /*, 'cover_thumbnail'*/],
    additionalProperties: false,
    properties: {
        id: {type: 'integer'},
        user_id: {type: 'integer'},
        title: {type: 'string', minLength: 3, maxLength: 100},
        description: {type: 'string', minLength: 5, maxLength: 1000},
        cover_index: {type: 'string', minLength: 1, maxLength: 500},
        cover_thumbnail: {type: 'string', minLength: 1, maxLength: 500},
        private: {type: 'boolean'}, // default TRUE
        event_location: {type: 'integer'}, // tag_id
        event_date: {type: 'string', format: 'date-time'},
        created_at: {type: 'string', format: 'date-time'},
        updated_at: {type: 'string', format: 'date-time'}
    }
};

Album.relationMappings = {

};

/**
 * ------------------------------
 * hooks
 * ------------------------------
 */

Album.prototype.$beforeInsert = function (json) {
    this.$validate();
};

Album.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
    this.$validate();
};

/**
 * ------------------------------
 * methods
 * ------------------------------
 */

/**
 * ------------------------------
 * @description ensure/create 'user-id-photo' folder >> create ALBUM model
 * ------------------------------
 * @param data
 */
Album.create = function (data) {
    var albumDirDate = moment().format('YYYYMMDD-HHmmss-x');
    var uid = '/uid-' + data.user_id + '/';

    return mz.readdir(PHOTOS_FOLDER)
        .then(function () { // ensure folder_name exist, if not create
            return [
                fsp.ensureDir(PHOTOS_FOLDER + uid),
                fsp.ensureDir(PHOTOS_FOLDER + uid + albumDirDate),
                fsp.ensureDir(PHOTOS_FOLDER + uid + albumDirDate + '/src'),
                fsp.ensureDir(PHOTOS_FOLDER + uid + albumDirDate + '/thumbnail-mid'),
                fsp.ensureDir(PHOTOS_FOLDER + uid + albumDirDate + '/thumbnail-low')
            ];
        })
        .then(function () { // create ALBUM model
            console.log(albumDirDate);
            console.log('Create model');
            // return this.query().insert(data);
        })
        .catch(function (error) {
            throw {error: error.message, statusCode: 500};
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
