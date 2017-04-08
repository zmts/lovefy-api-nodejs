'use strict';

const _ = require('lodash');
const Joi = require('joi');

const MainModel = require('./main');

/**
 * @model
 * id
 * user_id
 * title
 * content
 * private
 * created_at
 * updated_at
 */
function Post() {
    MainModel.apply(this, arguments);
}

Post.tableName = 'posts';
MainModel.extend(Post);

Post.rules = {
    CreateUpdate: {
        body: Joi.object().keys({
            user_id: Joi.number().integer().required(),
            title: Joi.string().min(5).max(50).required(),
            content: Joi.string().min(5).max(10000).required(),
            private: Joi.boolean(), // default FALSE
        })
    }
};

/**
 * ------------------------------
 * @RELATION_MAPPINGS
 * ------------------------------
 */

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

Post.GetById = function (id) {
    return this.query()
        .findById(id)
        .eager('tags')
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
 * @return public POSTs list
 */
Post.GetPubList = function (queryPage) {
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
 * @param queryPage INT
 * @return mix POSTs list
 */
Post.GetMixList = function (queryPage) {
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

Post.AttachTagToPost = function (post_id, tag_id) {
    return this.query()
        .findById(post_id)
        .then(function (post) {
            return post.$relatedQuery('tags').relate(tag_id);
        })
        .catch(function (error) {
            throw error;
        });
};

Post.DetachTagFromPost = function (post_id, tag_id) {
    return this.query()
        .findById(post_id)
        .then(function (post) {
            return post.$relatedQuery('tags').unrelate().where({ 'tag_id': tag_id });
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @description if TAG already exist in POST model >> throw error message
 */
Post.CheckTagByIdInPost = function (post_id, tag_id) {
    return this.query()
        .findById(post_id)
        .eager('tags')
        .then(function (data) {
            if ( _checkExistingTags(data, tag_id) ) throw { message: 'Tag already presents in post', status: 403 };
        })
        .catch(function (error) {
            throw error;
        });
};

module.exports = Post;
