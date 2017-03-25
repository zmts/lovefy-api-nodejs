'use strict';

const _ = require('lodash');

const MainModel = require('./main');

function Post() {
    MainModel.apply(this, arguments);
}

Post.tableName = 'posts';
MainModel.extend(Post);

Post.jsonSchema = {
    type: 'object',
    required: ['user_id', 'title', 'content'],
    additionalProperties: false,
    properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        title: { type: 'string', minLength: 5, maxLength: 50 },
        content: { type: 'string', minLength: 5, maxLength: 1000 },
        private: { type: 'boolean' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
    }
};

Post.relationMappings = {
    tags: {
        relation: MainModel.ManyToManyRelation,
        modelClass: __dirname + '/tag',
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

Post.prototype.$beforeInsert = function (/*json*/) {
    this.$validate();
};

Post.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
    this.$validate();
};

/**
 * ------------------------------
 * @HELPERS
 * ------------------------------
 */

function _checkExistingTags (data, tag_id) {
    return _.find(data.tags, function(item) {
        return +item.id === +tag_id;
    });
}

/**
 * ------------------------------
 * @METHODS
 * ------------------------------
 */

Post.getById = function (id) {
    return this.query()
        .findById(id)
        .eager('tags')
        .then(function (data) {
            if (!data) throw { message: 'Empty response' };
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

Post.getAllPub = function () {
    return this.query()
        .where({ private: false })
        .eager('tags')
        .then(function (data) {
            if (!data.length) throw { message: 'Empty response' };
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

Post.getAllMix = function () {
    return this.query()
        .eager('tags')
        .then(function (data) {
            if (!data.length) throw { message: 'Empty response' };
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

Post.attachTagToPost = function (post_id, tag_id) {
    return this.query()
        .findById(post_id)
        .then(function (post) {
            return post.$relatedQuery('tags').relate(tag_id);
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

Post.detachTagFromPost = function (post_id, tag_id) {
    return this.query()
        .findById(post_id)
        .then(function (post) {
            return post.$relatedQuery('tags').unrelate().where({ 'tag_id': tag_id });
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

/**
 * ------------------------------
 * description: if tag already exist in post model >> throw error message
 * ------------------------------
 */
Post.checkTagByIdInPost = function (post_id, tag_id) {
    return this.query()
        .findById(post_id)
        .eager('tags')
        .then(function (data) {
            if (!data) throw { message: 'Empty response' };
            if ( _checkExistingTags(data, tag_id) ) throw { message: 'Tag already presents in post' };
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

module.exports = Post;
