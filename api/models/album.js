'use strict';

var fs =require('fs');
var _ = require('lodash');

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
 * @description check for existing "user-id-photos" folder
 * if not exist >> create it
 * if exist >> create folder for ALBUM in PHOTOS_FOLDER >> create ALBUM
 * ------------------------------
 * @param data
 */
Album.testCreate = function (data) {
    console.log(PHOTOS_FOLDER);

    // fs.readdir(PHOTOS_FOLDER, function (error, folders) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         // find USER folder by mask 'user-id-photos' in 'PHOTOS_FOLDER'
    //         if ( folders.indexOf('foldername') >= 0) { // if folder exist, create folder by mask 'album-DD-MM-YYYY-HH-MM-SS'
    //
    //             fs.mkdir(PHOTOS_FOLDER + '/foldername/'+'one', function (error) {
    //                 if ( error ) {
    //                     console.log(error);
    //                 }
    //             });
    //
    //         } else { // create user folder by mask 'user-id-photos'
    //
    //             fs.mkdir(PHOTOS_FOLDER + '/foldername', function (error) {
    //                 if ( error ) {
    //                     console.log(error);
    //                 }
    //             });
    //
    //         }
    //     }
    // });

    // return this.query().insert(data);
};

Album.getById = function (id) {
    return this.query().findById(id)
        .then(function (data) {

        })
        .catch(function (error) {

        });
};

module.exports = Album;
