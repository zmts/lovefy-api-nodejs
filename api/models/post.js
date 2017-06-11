'use strict';

const _ = require('lodash');
const Joi = require('joi');

const MainModel = require('./main');
const Comment = require('./comment');

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

class Post extends MainModel {
    static get tableName() {
        return 'posts';
    }

    static get relationMappings () {
        return {
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
            },
            comments: {
                relation: MainModel.HasManyRelation,
                modelClass: __dirname + '/comment',
                filter: { type: 'post' },
                join: {
                    from: 'posts.id',
                    to: 'comments.entity_id'
                }
            }
        };
    }

    /**
     * ------------------------------
     * @HOOKS
     * ------------------------------
     */

    $beforeUpdate () {
        this.updated_at = new Date().toISOString();
        this.$validate();
    }
}

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
        .eager('[tags, comments]')
        .modifyEager('comments', builder => {
            builder.orderBy('created_at');
        })
        .then(data => {
            if (!data) throw { message: 'Empty response', status: 404 };
            return data;
        })
        .catch(error => {
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

/**
 * @description remove POST entity and all related COMMENTS
 * @param post_id
 * @return success status
 */
Post.Remove = function (post_id) {
    return this.REMOVE(post_id)
        .then(() => {
            return Comment.query()
                .delete()
                .where({ entity_id: post_id, type: 'post' });
        })
        .catch(error => {
            throw error;
        });
};

module.exports = Post;
