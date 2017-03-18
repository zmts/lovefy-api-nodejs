'use strict';

const fsp = require('fs-promise');
const Promise = require('bluebird');
const jimp = require('jimp');

const MainModel = require('./main');
const PHOTO_DIR = require('../config/').files.photo.localpath;
const PHOTO_URL = require('../config/').files.photo.globalpath;

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
        return `${PHOTO_URL}/uid-${this.user_id}/${this.id}/cover_thumbnail.jpg`;
    }
    return null;
};

Album.prototype._cover_index = function () {
    if (this.cover_index) {
        return `${PHOTO_URL}/uid-${this.user_id}/${this.id}/cover_index.jpg`;
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
 * @description
 * ------------------------------
 * @param data
 */
Album.create = function (data) {
    let that = this;
    let uid = '/uid-' + data.user_id + '/';

    return fsp.stat(PHOTO_DIR) // check root-photo dir accessibility
        .then(function () {
            return that.query().insert(data);
        })
        .then(function (model) {
            Promise.all([ // ensure folders
                fsp.ensureDir(PHOTO_DIR + uid),
                fsp.ensureDir(PHOTO_DIR + uid + model.id),
                fsp.ensureDir(PHOTO_DIR + uid + model.id + '/src'),
                fsp.ensureDir(PHOTO_DIR + uid + model.id + '/thumbnail-mid'),
                fsp.ensureDir(PHOTO_DIR + uid + model.id + '/thumbnail-low')
            ]).catch(function (error) {
                global.console.error((new Date).toUTCString());
                global.console.error(`ERROR: ${error.message}`);
                global.console.error(`ERROR PATH: ${__filename}`);

                return that.remove(model.id); // remove model if error
            });

            return model;
        })
        .catch(function (error) {
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
 * @description: set in DB "cover_index" field to TRUE
 * ------------------------------
 * @param album_id
 */
Album.setCoverIndex = function (album_id) {
    let that = this;

    return this.getById(album_id)
        .then(function (model) {
            return that.query().patchAndFetchById(model.id, { cover_index: true });
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * ------------------------------
 * @description: set in DB "cover_index" field to FALSE(soft delete)
 * ------------------------------
 * @param album_id
 */
Album.removeCoverIndex = function (album_id) {
    let that = this;

    return this.getById(album_id)
        .then(function (model) {
            return that.query().patchAndFetchById(model.id, { cover_index: false });
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * ------------------------------
 * @description: set in DB "cover_thumbnail" field to TRUE
 * ------------------------------
 * @param album_id
 */
Album.setCoverThumbnail = function (album_id) {
    let that = this;

    return this.getById(album_id)
        .then(function (model) {
            return that.query().patchAndFetchById(model.id, { cover_thumbnail: true });
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * ------------------------------
 * @description: set in DB "cover_thumbnail" field to FALSE(soft delete)
 * ------------------------------
 * @param album_id
 */
Album.removeCoverThumbnail = function (album_id) {
    let that = this;

    return this.getById(album_id)
        .then(function (model) {
            return that.query().patchAndFetchById(model.id, { cover_thumbnail: false });
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
 * @return {Promise.<T>}
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
            // TODO: insert photo model >> something like this >>
            // Photo.create({
            //     filename: photoWrapper.filename,
            //     user_id: user_id,
            //     album_id: album_id
            // });
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

module.exports = Album;
