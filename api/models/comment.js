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
            content: Joi.string().min(3).max(500).required(),
        })
    }
};

Comment.GetPostCommentsById = function (entity_id) {
    return this.query().where({ entity_id, type: 'post' }).orderBy('created_at');
};

Comment.GetAlbumCommentsById = function (entity_id) {
    return this.query().where({ entity_id, type: 'album' }).orderBy('created_at');
};

Comment.GetPhotoCommentsById = function (entity_id) {
    return this.query().where({ entity_id, type: 'photo' }).orderBy('created_at');
};

/**
 * ------------------------------
 * @METHODS
 * ------------------------------
 */


module.exports = Comment;
