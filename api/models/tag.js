'use strict';

const Promise = require('bluebird');

const MainModel = require('./main');

function Tag() {
    MainModel.apply(this, arguments);
}

Tag.tableName = 'tags';
MainModel.extend(Tag);

Tag.jsonSchema = {
    type: 'object',
    required: ['name'],
    additionalProperties: false,
    properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 3, maxLength: 30 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
    }
};

Tag.relationMappings = {
    posts: {
        relation: MainModel.ManyToManyRelation,
        modelClass: __dirname + '/post',
        join: {
            from: 'posts.id',
            through: {
                from: 'posts_tags.post_id',
                to: 'posts_tags.tag_id'
            },
            to: 'tags.id'
        }
    },
    albums: {
        relation: MainModel.ManyToManyRelation,
        modelClass: __dirname + '/album',
        join: {
            from: 'albums.id',
            through: {
                from: 'albums_tags.album_id',
                to: 'albums_tags.tag_id'
            },
            to: 'tags.id'
        }
    }
};

/**
 * ------------------------------
 * @HOOKS
 * ------------------------------
 */

Tag.prototype.$formatJson = function (json) {
    json = MainModel.prototype.$formatJson.call(this, json);
    delete json.created_at;
    delete json.updated_at;
    return json;
};

Tag.prototype.$beforeInsert = function () {
    // this.$validate();
};

Tag.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
};

/**
 * ------------------------------
 * @METHODS
 * ------------------------------
 */

Tag.FindByString = function (str) {
    if (!str) return Promise.reject('Query not defined');
    return this.query()
        .where('name', 'like', `%${str}%`)
        .limit(10)
        .then(function (data) {
            if (!data.length) throw { message: 'Empty response', status: 404 };
            return data;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @param id
 * @return TAG model with all public related ALBUM's and POST's
 */
Tag.GetById = function (id) {
    return this.query()
        .findById(id)
        .eager('posts')
        .mergeEager('albums')
        .modifyEager('posts', function(builder) {
            builder.where({ private: false }).orderBy('updated_at', 'desc');
        })
        .modifyEager('albums', function(builder) {
            builder.where({ private: false }).orderBy('updated_at', 'desc');
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
 * @param tag_id
 * @returns only public POST's list
 */
Tag.GetPubPostsByTagId = function (tag_id) {
    return this.query()
        .findById(tag_id)
        .modifyEager('posts', function(builder) {
            builder.where({ private: false }).orderBy('updated_at', 'desc');
        })
        .eager('posts')
        .then(function (data) {
            if (!data) throw { message: 'Empty response', status: 404 };
            return data;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @param tag_id
 * @returns only public ALBUM's list
 */
Tag.GetPubAlbumsByTagId = function (tag_id) {
    return this.query()
        .findById(tag_id)
        .modifyEager('albums', function(builder) {
            builder.where({ private: false }).orderBy('updated_at', 'desc');
        })
        .eager('albums')
        .then(function (data) {
            if (!data) throw { message: 'Empty response', status: 404 };
            return data;
        })
        .catch(function (error) {
            throw error;
        });
};

module.exports = Tag;
