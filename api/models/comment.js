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

class Comment extends MainModel {
    static get tableName() {
        return 'comments';
    }

    /**
     * ------------------------------
     * @HOOKS
     * ------------------------------
     */
    $formatJson(json) {
        json = super.$formatJson(json);

        // delete field from json if field is NULL
        json.post_id ? json.post_id : delete json.post_id;
        json.album_id ? json.album_id : delete json.album_id;
        json.photo_id ? json.photo_id : delete json.photo_id;

        return json;
    }

    $beforeUpdate () {
        this.updated_at = new Date().toISOString();
        this.$validate();
    }
}

Comment.rules = {
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


module.exports = Comment;
