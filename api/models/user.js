'use strict';

const Promise = require('bluebird');

const MainModel = require('./main');

function User() {
    MainModel.apply(this, arguments);
}

User.tableName = 'users';
MainModel.extend(User);

User.jsonSchema = {
    type: 'object',
    required: ['name', 'email', 'password_hash'],
    additionalProperties: false,
    properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 3, maxLength: 30 },
        email: { type: 'string', format: 'email', minLength: 5, maxLength: 50 },
        password_hash: { type: 'string' },
        // role: { type: 'string' }, user don't have ability to set "role" via registration process
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
    }
};

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
    delete json.role;
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
 * @METHODS
 * ------------------------------
 */

User.GetByEmail = function (email) {
    if (!email) return Promise.reject('Query not defined');
    return this.query().where({ email: email })
        .then(function (data) {
            if (!data.length) throw { message: 'Empty response' };
            return data[0]; // email field is unique and should pass only one first item
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

User.GetByName = function (name) {
    if (!name) return Promise.reject('Query not defined');
    return this.query().where({ name: name })
        .then(function (data) {
            if (!data.length) throw { message: 'Empty response' };
            return data[0];
        })
        .catch(function (error) {
            throw error.message || error;
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
        .then(function (data) {
            if (!data[0].posts.length) throw { message: 'Empty response' };
            return data[0].posts;
        })
        .catch(function (error) {
            throw error.message || error;
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
            builder.where({ private: false });
        })
        .then(function (data) {
            if (!data[0].posts.length) throw { message: 'Empty response' };
            return data[0].posts;
        })
        .catch(function (error) {
            throw error.message || error;
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
        .then(function (data) {
            if (!data[0].albums.length) throw { message: 'Empty response' };
            return data[0].albums;
        })
        .catch(function (error) {
            throw error.message || error;
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
            builder.where({ private: false });
        })
        .then(function (data) {
            if (!data[0].albums.length) throw { message: 'Empty response' };
            return data[0].albums;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

module.exports = User;
