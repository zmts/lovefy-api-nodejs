'use strict';

// const _ = require('lodash');
const Joi = require('joi');

const MainModel = require('./main');

/**
 * @model
 * id
 * user_id
 * content
 * created_at
 * updated_at
 */

class CommentToPost extends MainModel {
    static get tableName() {
        return 'comments';
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

CommentToPost.rules = {
    CreateUpdate: {
        body: Joi.object().keys({
            user_id: Joi.number().integer().required(),
            content: Joi.string().min(3).max(500).required(),
        })
    }
};


/**
 * ------------------------------
 * @METHODS
 * ------------------------------
 */


module.exports = CommentToPost;
