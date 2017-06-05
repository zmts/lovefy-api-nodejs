'use strict';

const fse = require('fs-extra');
const Promise = require('bluebird');
const jimp = require('jimp');
const _ = require('lodash');
const Joi = require('joi');

const MainModel = require('./main');
const Photo = require('./photo');
const PHOTO_DIR = require('../config/').photoDir;

/**
 * @model
 * id
 * user_id
 * title
 * description
 * private
 * event_location
 * event_date
 * cover_index
 * cover_thumbnail
 * created_at
 * updated_at
 * _cover_thumbnail
 * _cover_index
 */

class Album extends MainModel {
    static get tableName() {
        return 'albums';
    }

    static get relationMappings() {
        return {
            photos: {
                relation: MainModel.HasManyRelation,
                modelClass: __dirname + '/photo',
                join: {
                    from: 'albums.id',
                    to: 'photos.album_id'
                }
            },
            tags: {
                relation: MainModel.ManyToManyRelation,
                modelClass: __dirname + '/tag',
                join: {
                    from: 'albums.id',
                    through: {
                        from: 'albums_tags.album_id',
                        to: 'albums_tags.tag_id'
                    },
                    to: 'tags.id'
                }
            },
            comments: {
                relation: MainModel.HasManyRelation,
                modelClass: __dirname + '/comment',
                filter: { type: 'album' },
                join: {
                    from: 'albums.id',
                    to: 'comments.entity_id'
                }
            }
        };

    }
}

/**
 * ------------------------------
 * @VALIDATION_RULES
 * ------------------------------
 */

Album.rules = {
    CreateUpdate: {
        body: Joi.object().keys({
            name: Joi.string().min(3).max(30),
            user_id: Joi.number().integer().required(),
            title: Joi.string().min(3).max(100),
            description: Joi.string().min(5).max(1000),
            private: Joi.boolean(),
            event_location: Joi.number().integer(),
            event_date: Joi.date().iso(),
            cover_index: Joi.boolean(),
            cover_thumbnail: Joi.boolean()
        })
    },
    SetCover: {
        query: Joi.object().keys({
            status: Joi.boolean().required()
        })
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

/**
 * ------------------------------
 * @HELPERS
 * ------------------------------
 */

/**
 * @description find TAG by id in ALBUM
 * @param data
 * @param tag_id
 * @private
 */
function _checkExistingTags (data, tag_id) {
    return _.find(data.tags, function(item) {
        return +item.id === +tag_id;
    });
}

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

Album.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
};

/**
 * ------------------------------
 * @METHODS
 * ------------------------------
 */

/**
 * @description check PHOTO_DIR accessibility >> create model >> create folders in FS
 * @return ALBUM model
 * @param data
 */
Album.Create = function (data) {
    let that = this;
    let uid = '/uid-' + data.user_id + '/';

    return fse.stat(PHOTO_DIR) // check root-photo dir accessibility
        .then(function () {
            return that.CREATE(data);
        })
        .then(function (model) {
            Promise.all([ // ensure folders
                fse.ensureDir(PHOTO_DIR + uid),
                fse.ensureDir(PHOTO_DIR + uid + model.id),
                fse.ensureDir(PHOTO_DIR + uid + model.id + '/src'),
                fse.ensureDir(PHOTO_DIR + uid + model.id + '/thumbnail-mid'),
                fse.ensureDir(PHOTO_DIR + uid + model.id + '/thumbnail-low')
            ]).catch(function (error) {
                global.console.error( (new Date).toUTCString() );
                global.console.error(`ERROR: ${error.message}`);
                global.console.error(`ERROR PATH: ${__filename}`);

                return that.REMOVE(model.id); // remove model if error
            });

            return model;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @param id
 * @return ALBUM with all related PHOTO's, TAG's, COMMENTs to ALBUM
 */
Album.GetById = function (id) {
    return this.query()
        .findById(id)
        .eager('[photos, tags, comments]')
        .modifyEager('comments', builder => {
            builder.orderBy('created_at');
        })
        .then(function (data) {
            if (!data) throw { message: 'Empty response', status: 404 };
            return data;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @param queryPage INT
 * @return all mix ALBUM's
 */
Album.GetMixList = function (queryPage) {
    let pageNumber = _.isInteger(queryPage) ? queryPage : 0;

    return this.query()
        .eager('tags')
        .orderBy('id', 'desc')
        .page(pageNumber, process.env.PAGE_SIZE)
        .then(function (data) {
            if (!data.results.length) throw { message: 'Empty response', status: 404 };
            return data;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @param queryPage INT
 * @return all public ALBUM's
 */
Album.GetPubList = function (queryPage) {
    let pageNumber = _.isInteger(queryPage) ? queryPage : 0;

    return this.query()
        .where({ private: false })
        .eager('tags')
        .orderBy('id', 'desc')
        .page(pageNumber, process.env.PAGE_SIZE)
        .then(function (data) {
            if (!data.results.length) throw { message: 'Empty response', status: 404 };
            return data;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @description: set in DB "cover_index" field to TRUE/FALSE
 * @param album_id
 * @param status BOOLEAN
 * @return updated ALBUM model
 */
Album.SetCoverIndex = function (album_id, status) {
    let that = this;

    return this.GETbyId(album_id)
        .then(function (model) {
            return that.query().patchAndFetchById(model.id, { cover_index: JSON.parse(status) });
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @description: set in DB "cover_thumbnail" field to TRUE/FALSE
 * @param album_id
 * @param status BOOLEAN
 * @return updated ALBUM model
 */
Album.SetCoverThumbnail = function (album_id, status) {
    let that = this;

    return this.GETbyId(album_id)
        .then(function (model) {
            return that.query().patchAndFetchById(model.id, { cover_thumbnail: JSON.parse(status) });
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @description: create thumbnail, create PHOTO model
 * @param album_id
 * @param user_id
 * @param photoWrapper
 * @return created PHOTO model
 */
Album.ProcessOnePhotoToAlbum = function (album_id, user_id, photoWrapper) {
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
            return Photo.CREATE({
                filename: photoWrapper.filename,
                album_id: +album_id,
                user_id: +user_id
            });
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @description erase ALBUM dir from FS >> remove ALBUM row from DB
 * @param album_id
 * @return success status
 */
Album.EraseAlbum = function (album_id) {
    let that = this;

    return this.GETbyId(album_id)
        .then(function (album) {
            return fse.remove(`${PHOTO_DIR}/uid-${album.user_id}/${album.id}`);
        })
        .then(function () {
            return that.REMOVE(album_id);
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @description attach TAG to ALBUM
 * @param album_id
 * @param tag_id
 * @return tag_id
 */
Album.AttachTagToAlbum = function (album_id, tag_id) {
    return this.GETbyId(album_id)
        .then(function (album) {
            return album.$relatedQuery('tags').relate(tag_id);
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @description detach TAG from ALBUM
 * @param album_id
 * @param tag_id
 * @return tag_id
 */
Album.DetachTagFromAlbum = function (album_id, tag_id) {
    return this.GETbyId(album_id)
        .then(function (album) {
            return album.$relatedQuery('tags').unrelate().where({ 'tag_id': tag_id });
        })
        .then(function () {
            return tag_id;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @description if TAG already exist in ALBUM model >> throw error message
 * @param album_id
 * @param tag_id
 * @return status
 */
Album.CheckTagByIdInAlbum = function (album_id, tag_id) {
    return this.query()
        .findById(album_id)
        .eager('tags')
        .then(function (data) {
            if ( _checkExistingTags(data, tag_id) ) throw { message: 'Tag already presents in post', status: 403 };
        })
        .catch(function (error) {
            throw error;
        });
};

Album.GetLastAlbum = function () {
    return this.query().where({ private: false }).orderBy('id', 'desc').limit(1);
};

module.exports = Album;
