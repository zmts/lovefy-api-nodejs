'use strict';

var MainModel = require('./main');

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
        id: {type: 'integer'},
        user_id: {type: 'integer'},
        title: {type: 'string', minLength: 5, maxLength: 50},
        content: {type: 'string', minLength: 5, maxLength: 1000},
        private: {type: 'boolean'},
        created_at: {type: 'string', format: 'date-time'},
        updated_at: {type: 'string', format: 'date-time'}
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
 * hooks
 * ------------------------------
 */

Post.prototype.$beforeInsert = function (json) {
    this.$validate();
};

Post.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
    this.$validate();
};

/**
 * ------------------------------
 * methods
 * ------------------------------
 */

Post.getById = function (id) {
    return this.query()
        .findById(id)
        .eager('tags')
        .then(function (data) {
            if (!data) throw {message: 'Empty response'};
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

Post.getAllPub = function () {
    return this.query()
        .where({private: false})
        .eager('tags')
        .then(function (data) {
            if (!data.length) throw {message: 'Empty response'};
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
            if (!data.length) throw {message: 'Empty response'};
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

module.exports = Post;
