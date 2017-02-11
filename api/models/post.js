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

Post.jsonSchemaUpdate = {
    type: 'object',
    required: ['title', 'content'],
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

Post.prototype.$beforeInsert = function (json) {
    this.$validate();
};

Post.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
    this.$validate();
};

Post.getAllPub = function () {
    return this.query().where({private: false})
        .then(function (data) {
            if (!data.length) throw {message: 'Empty response'};
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

module.exports = Post;
