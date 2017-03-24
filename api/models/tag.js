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

Tag.findByString = function (str) {
    if (!str) return Promise.reject('Query not defined');
    return this.query()
        .where('name', 'like', `%${str}%`)
        .limit(10)
        .then(function (data) {
            if (!data.length) throw { message: 'Empty response' };
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * @param tagId
 * @returns {Promise} public POSTS list
 */
Tag.getPublicPostsByTagId = function (tagId) {
    return this.query()
        .findById(tagId)
        .modifyEager('posts', function(builder) {
            builder.where({ private: false }).orderBy('user_id', 'updated_at');
        })
        .eager('posts')
        .then(function (data) {
            if (!data) throw { message: 'Empty response' };
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * @param userId
 * @param tagId
 * @returns {Promise} only current USER mixed POSTS
 */
Tag.getCurrentUserPostsByTagId = function (userId, tagId) {
    return this.query()
        .findById(tagId)
        .eager('posts')
        .modifyEager('posts', function(builder) {
            builder.where({ user_id: userId }).orderBy('updated_at');
        })
        .then(function (data) {
            if (!data) throw { message: 'Empty response' };
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * @param userId
 * @param tagId
 * @returns {Promise} All mix USER POSTS + other USERS public POSTS
 */
Tag.getMixPostsByTagId = function (userId, tagId) {
    return this.query()
        .findById(tagId)
        .eager('posts')
        .modifyEager('posts', function(builder) {
            builder.where({ user_id: userId })
                .orWhere({ private: false })
                .orderBy('user_id', 'updated_at');
        })
        .then(function (data) {
            if (!data) throw { message: 'Empty response' };
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

module.exports = Tag;
