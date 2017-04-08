'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const Joi = require('joi');

const MainModel = require('./main');

/**
 * @model
 * id
 * name
 * created_at
 * updated_at
 */
function Tag() {
    MainModel.apply(this, arguments);
}

Tag.tableName = 'tags';
MainModel.extend(Tag);

/**
 * ------------------------------
 * @VALIDATION_RULES
 * ------------------------------
 */

Tag.rules = {
    CreateUpdate: {
        body: Joi.object().keys({
            name: Joi.string().min(3).max(30).required(),
        })
    }
};

/**
 * ------------------------------
 * @RELATION_MAPPINGS
 * ------------------------------
 */

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
 * @param tag_id
 * @param queryPage
 * @returns only public POST's list
 */
Tag.GetPubPostsByTagId = function (tag_id, queryPage) {
    let pageNumber = _.isInteger(queryPage) ? queryPage : 0;

    return this.query()
        .findById(tag_id)
        .then(function (tag) {
            return tag.$relatedQuery('posts')
                .where({ private: false })
                .orderBy('id', 'desc')
                .page(pageNumber, process.env.PAGE_SIZE)
                .then(function (posts) {
                    if (!posts.results.length) throw { message: 'Empty response', status: 404 };
                    return posts;
                });
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
 * @param queryPage
 * @returns only public ALBUM's list
 */
Tag.GetPubAlbumsByTagId = function (tag_id, queryPage) {
    let pageNumber = _.isInteger(queryPage) ? queryPage : 0;

    return this.query()
        .findById(tag_id)
        .then(function (tag) {
            return tag.$relatedQuery('albums')
                .where({ private: false })
                .orderBy('id', 'desc')
                .page(pageNumber, process.env.PAGE_SIZE)
                .then(function (albums) {
                    if (!albums.results.length) throw { message: 'Empty response', status: 404 };
                    return albums;
                });
        })
        .then(function (data) {
            if (!data) throw { message: 'Empty response', status: 404 };
            return data;
        })
        .catch(function (error) {
            throw error;
        });
};

module.exports = Tag;
