'use strict';

const Promise = require('bluebird');
const Joi = require('joi');

const MainModel = require('./main');
const CONFIG = require('../config');

/**
 * @model
 * id {string},
 * name: {type: string, minLength: 3, maxLength: 30},
 * email: {type: string, format: email, minLength: 5, maxLength: 50},
 * password_hash: {type: string},
 * role: {type: string},
 * created_at: {type: string, format: date-time},
 * updated_at: {type: string, format: date-time}}
 */

function User() {
    MainModel.apply(this, arguments);
}

User.tableName = 'users';
MainModel.extend(User);

/**
 * ------------------------------
 * @VALIDATION_RULES
 * ------------------------------
 */

User.rules = {
    CreateUpdate: {
        body: Joi.object().keys({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().min(6).max(30).required(),
            password_hash: Joi.string().required()
        })
    },

    ChangeUserRole: {
        body: Joi.object().keys({
            role: Joi.string().required()
        })
    }
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
 * @HOOKS
 * ------------------------------
 */

User.prototype.$formatJson = function (json) {
    json = MainModel.prototype.$formatJson.call(this, json);
    delete json.password_hash;
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

module.exports = User;
