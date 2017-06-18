'use strict';

const Promise = require('bluebird');
const Joi = require('joi');

const MainModel = require('./main');
const CONFIG = require('../config');

/**
 * @model
 * id {string},
 * name: {type: string, min: 3, max: 30},
 * email: {type: string, format: email, min: 5, max: 50},
 * description {type: string, min: 5, max: 500},
 * password_hash: {type: string},
 * role: {type: string},
 * refresh_token: {type: string},
 * created_at: {type: string, format: date-time},
 * updated_at: {type: string, format: date-time}}
 */

class User extends MainModel {
    static get tableName() {
        return 'users';
    }
}


/**
 * ------------------------------
 * @VALIDATION_RULES
 * ------------------------------
 */

User.rules = {
    Create: {
        body: Joi.object().keys({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().min(6).max(30).required(),
            description: Joi.string().min(5).max(300),
            password_hash: Joi.string().required(),
            _avatar: Joi.string(),
            helpData: Joi.object()
        })
    },

    Update: {
        body: Joi.object().keys({
            name: Joi.string().min(3).max(30),
            email: Joi.string().email().min(6).max(30),
            description: Joi.string().min(5).max(300),
            helpData: Joi.object()
        })
    },

    ChangePassword: {
        body: Joi.object().keys({
            password_hash: Joi.string().required(),
            oldPassword: Joi.string().min(6).max(30),
            newPassword: Joi.string().min(6).max(30),
            helpData: Joi.object()
        })
    },

    ChangeUserRole: {
        body: Joi.object().keys({
            role: Joi.string().required()
        })
    },

    AvatarStatus: {
        query: Joi.object().keys({
            status: Joi.boolean().required()
        })
    },
};

/**
 * ------------------------------
 * @RELATION_MAPPINGS
 * ------------------------------
 */

User.relationMappings = {
    posts: {
        relation: MainModel.HasManyRelation,
        modelClass: __dirname + '/post',
        join: {
            from: 'users.id',
            to: 'posts.user_id'
        }
    },
    albums: {
        relation: MainModel.HasManyRelation,
        modelClass: __dirname + '/album',
        join: {
            from: 'users.id',
            to: 'albums.user_id'
        }
    }
};

/**
 * ------------------------------
 * @VIRTUAL_ATTRIBUTES
 * ------------------------------
 */
User.virtualAttributes = [
    '_avatar',
];

User.prototype._avatar = function () {
    if (this.avatar) {
        return `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/userfiles/${this.id}/avatar.jpg`;
    }
    return null;
};

/**
 * ------------------------------
 * @HOOKS
 * ------------------------------
 */

User.prototype.$formatJson = function (json) {
    json = MainModel.prototype.$formatJson.call(this, json);
    delete json.password_hash;
    delete json.refresh_token;
    delete json.avatar;
    return json;
};

User.prototype.$beforeInsert = function () {
    // this.$validate();
};

User.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
};

/**
 * ------------------------------
 * @HELPERS
 * ------------------------------
 */

/**
 * @description the name of the data.role should only be as specified in the config.roles
 * @param data
 * @return {boolean}
 * @private
 */
function _validateRoleName(data) {
    if ( CONFIG.roles.adminRoles.indexOf(data.role) >= 0 ) return true;
    if ( CONFIG.roles.editorRoles.indexOf(data.role) >= 0 ) return true;
    if ( CONFIG.roles.user === data.role ) return true;
}

/**
 * ------------------------------
 * @METHODS
 * ------------------------------
 */

User.GetByEmail = function (email) {
    return this.query().where({ email: email })
        .then(function (data) {
            if (!data.length) throw { message: 'Empty response', status: 404 };
            return data[0]; // email field is unique and should pass only one first item
        })
        .catch(function (error) {
            throw error;
        });
};

User.GetByName = function (name) {
    return this.query().where({ name: name })
        .then(function (data) {
            if (!data.length) throw { message: 'Empty response', status: 404 };
            return data[0];
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @param id
 * @return mix POST's by user_id (with related TAG's)
 */
User.GetMixPostsByUserId = function (id) {
    return this.query()
        .where({ id: id })
        .eager('posts.tags')
        .modifyEager('posts', function(builder) {
            builder.orderBy('id', 'desc');
        })
        .then(function (data) {
            if (!data[0].posts.length) throw { message: 'Empty response', status: 404 };
            return data[0].posts;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @param id
 * @return public POST's by user_id (with related TAG's)
 */
User.GetPubPostsByUserId = function (id) {
    return this.query()
        .where({ id: id })
        .eager('posts.tags')
        .modifyEager('posts', function(builder) {
            builder.where({ private: false }).orderBy('id', 'desc');
        })
        .then(function (data) {
            if (!data[0].posts.length) throw { message: 'Empty response', status: 404 };
            return data[0].posts;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @param id
 * @return mix ALBUM's by user_id (with related TAG's)
 */
User.GetMixAlbumsByUserId = function (id) {
    return this.query()
        .where({ id: id })
        .eager('albums.tags')
        .modifyEager('albums', function(builder) {
            builder.orderBy('id', 'desc');
        })
        .then(function (data) {
            if (!data[0].albums.length) throw { message: 'Empty response', status: 404 };
            return data[0].albums;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @param id
 * @return public ALBUM's by user_id (with related TAG's)
 */
User.GetPubAlbumsByUserId = function (id) {
    return this.query()
        .where({ id: id })
        .eager('albums.tags')
        .modifyEager('albums', function(builder) {
            builder.where({ private: false }).orderBy('id', 'desc');
        })
        .then(function (data) {
            if (!data[0].albums.length) throw { message: 'Empty response', status: 404 };
            return data[0].albums;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @param user_id
 * @param data
 * @return updated model with new role
 */
User.ChangeUserRole = function (user_id, data) {
    let that = this;
    if (!_validateRoleName(data)) return Promise.reject({ message: 'Invalid role', status: 403 });

    return this.GETbyId(user_id)
        .then(function (user) {
            return that.UPDATE(user.id, data);
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * @description: set in DB "avatar" field to TRUE/FALSE
 * @param user_id
 * @param status BOOLEAN
 * @return updated USER model
 */
User.SetAvatarStatus = function (user_id, status) {
    return this.GETbyId(user_id)
        .then( model => {
            return this.query().patchAndFetchById(model.id, { avatar: JSON.parse(status) });
        })
        .catch(error => {
            throw error;
        });
};

module.exports = User;
