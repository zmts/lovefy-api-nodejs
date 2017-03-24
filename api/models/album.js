'use strict';

const fsp = require('fs-promise');
const Promise = require('bluebird');
const jimp = require('jimp');

const MainModel = require('./main');
const Photo = require('./photo');
const PHOTO_DIR = require('../config/').photoDir;

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
    required: ['user_id'],
    additionalProperties: false,
    properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        title: { type: 'string', minLength: 3, maxLength: 100 },
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
        return `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/photos/uid-${this.user_id}/${this.id}/cover_thumbnail.jpg`;
    }
    return null;
};

Album.prototype._cover_index = function () {
    if (this.cover_index) {
        return `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/photos/uid-${this.user_id}/${this.id}/cover_index.jpg`;
    }
    return null;
};

Album.relationMappings = {
    photos: {
        relation: MainModel.HasManyRelation,
        modelClass: __dirname + '/photo',
        join: {
            from: 'albums.id',
            to: 'photos.album_id'
        }
    }
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

Album.prototype.$beforeInsert = function (/*json*/) {
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
 * @description check PHOTO_DIR accessibility >> create model >> create folders in FS
 * @return ALBUM model
 * ------------------------------
 * @param data
 */
Album.create = function (data) {
    let that = this;
    let uid = '/uid-' + data.user_id + '/';

    return fsp.stat(PHOTO_DIR) // check root-photo dir accessibility
        .then(function () {
            return that.CREATE(data);
        })
        .then(function (model) {
            Promise.all([ // ensure folders
                fsp.ensureDir(PHOTO_DIR + uid),
                fsp.ensureDir(PHOTO_DIR + uid + model.id),
                fsp.ensureDir(PHOTO_DIR + uid + model.id + '/src'),
                fsp.ensureDir(PHOTO_DIR + uid + model.id + '/thumbnail-mid'),
                fsp.ensureDir(PHOTO_DIR + uid + model.id + '/thumbnail-low')
            ]).catch(function (error) {
                global.console.error( (new Date).toUTCString() );
                global.console.error(`ERROR: ${error.message}`);
                global.console.error(`ERROR PATH: ${__filename}`);

                return that.REMOVE(model.id); // remove model if error
            });

            return model;
        })
        .catch(function (error) {
            throw error.message;
        });
};

/**
 * @param id
 * @return ALBUM with all related PHOTOS
 */
Album.getById = function (id) {
    return this.query()
        .findById(id)
        .eager('photos')
        .then(function (data) {
            if (!data) throw { message: 'Empty response' };
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * @description look getAllPub(), getAllOwnAndOtherPublic()
 * @param user_id
 * @param isAdmin
 */
Album.getAllAccessSwitcher = function (user_id, isAdmin) {
    if (isAdmin) return this.GETall(); // return full list(private and public) of all USER's
    if (user_id) return this.getAllOwnAndOtherPublic(user_id);
    return this.getAllPub();
};

/**
 * @return all public ALBUM's
 */
Album.getAllPub = function () {
    return this.query()
        .where({ private: false })
        .then(function (data) {
            if (!data.length) throw { message: 'Empty response' };
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * @return all own ALBUM's + all public ALBUM's others USER's
 */
Album.getAllOwnAndOtherPublic = function (user_id) {
    return this.query()
        .where({ user_id: user_id })
        .orWhere({ private: false })
        .then(function (data) {
            if (!data.length) throw { message: 'Empty response' };
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * ------------------------------
 * @description: set in DB "cover_index" field to TRUE/FALSE
 * ------------------------------
 * @param album_id INT
 * @param status BOOLEAN
 * @return updated ALBUM model
 */
Album.setCoverIndex = function (album_id, status) {
    let that = this;

    if (!status) return Promise.reject('>>> \'status\' <<< field in query not defined');
    return this.GETbyId(album_id)
        .then(function (model) {
            return that.query().patchAndFetchById(model.id, { cover_index: JSON.parse(status) });
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * ------------------------------
 * @description: set in DB "cover_thumbnail" field to TRUE/FALSE
 * ------------------------------
 * @param album_id INT
 * @param status BOOLEAN
 * @return updated ALBUM model
 */
Album.setCoverThumbnail = function (album_id, status) {
    let that = this;

    if (!status) return Promise.reject('>>> \'status\' <<< field in query not defined');
    return this.GETbyId(album_id)
        .then(function (model) {
            return that.query().patchAndFetchById(model.id, { cover_thumbnail: JSON.parse(status) });
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * ------------------------------
 * @description: create thumbnail, create PHOTO model
 * ------------------------------
 * @param album_id
 * @param user_id
 * @param photoWrapper
 * @return created PHOTO model
 */
Album.processOnePhotoToAlbum = function (album_id, user_id, photoWrapper) {
    return jimp.read(photoWrapper.path)
        .then(function (photoRaw) {
            return photoRaw
                .cover(400, 266)
                .quality(90)
                .write(`${PHOTO_DIR}/uid-${user_id}/${album_id}/thumbnail-mid/${photoWrapper.filename}`);
        })
        .then(function (thumbnailMid) {
            return thumbnailMid
                .cover(200, 133)
                .quality(90)
                .write(`${PHOTO_DIR}/uid-${user_id}/${album_id}/thumbnail-low/${photoWrapper.filename}`);
        })
        .then(function () {
            return Photo.create({
                filename: photoWrapper.filename,
                album_id: +album_id,
                user_id: +user_id
            });
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * @description erase ALBUM dir from FS >> remove ALBUM row from DB
 * @param album_id
 * @return success status
 */
Album.eraseAlbum = function (album_id) {
    let that = this;

    return this.GETbyId(album_id)
        .then(function (album) {
            return fsp.remove(`${PHOTO_DIR}/uid-${album.user_id}/${album.id}`);
        })
        .then(function () {
            return that.REMOVE(album_id);
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

module.exports = Album;
