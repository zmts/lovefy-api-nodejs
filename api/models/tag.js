'use strict';

var MainModel = require('./main');

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
        id: {type: 'integer'},
        name: {type: 'string', minLength: 3, maxLength: 30},
        created_at: {type: 'string', format: 'date-time'},
        updated_at: {type: 'string', format: 'date-time'}
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
 * hooks
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
 * methods
 * ------------------------------
 */

Tag.findByString = function (str) {
    return this.query()
        .where('name', 'like', `%${str}%`)
        .limit(10)
        .then(function (data) {
            if (!data.length) throw {message: 'Empty response'};
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

Tag.getPublicPostsByTagId = function (tagId) {
    return this.query()
        .findById(tagId)
        .modifyEager('posts', function(builder) {
            builder.where({private: false});
        })
        .eager('posts')
        .then(function (data) {
            if (!data) throw {message: 'Empty response'};
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

Tag.getMixPostsByTagId = function (tagId) {
    return this.query()
        .findById(tagId)
        .eager('posts')
        .then(function (data) {
            if (!data) throw {message: 'Empty response'};
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

Tag.getByIdOrCreate = function (tag_id, body) {
    var that = this;
    return this.query()
        .findById(tag_id)
        .then(function (tag) {
            if (!tag) return that.create(body);
            return tag;
        })
        .catch(function (error) {
            throw error.message || error;
        });
}

module.exports = Tag;
