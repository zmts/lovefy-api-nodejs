'use strict';

var Joi = require('joi');
var MainModel = require('./main');
var bookshelf = require('../config/db').bookshelf;

require('./post');

var validationSchema = Joi.object().keys({
    id: Joi.number().integer(),
    name: Joi.string().min(4).max(30).required(),
    email: Joi.string().email().min(5).max(30).required(),
    password_hash: Joi.string().required(),
    role: Joi.string(),
    created_at: Joi.date(),
    updated_at: Joi.date()
});

var User = MainModel.extend({
        tableName: 'users',
        hasTimestamps: true,
        hidden: ['password_hash'],
        posts: function() {
            return this.hasMany('Post');
        },

        initialize: function () {
            this.on('saving', this.validate);
            this.on('creating', this.validate);
        },

        validate: function () {
            return Joi.validate(this.serialize(), validationSchema, function (error, value) {
                if (error) { throw ({success: false, message: error.name, details: error.details}) }
            });
        }

    }, // end static methods

    {
        getByName: function (name) {
            return this.forge().where({'name': name}).fetch({require: true})
        },

        getByEmail: function (email) {
            return this.forge().where({'email': email}).fetch({require: true})
        },

        getAllMixPosts: function (id) {
            return this.forge().where({'id': id}).fetch({withRelated: ['posts'], require: true});
        },

        getAllPubPosts: function (id) {
            return this
                .forge()
                .where({'id': id})
                .fetch({
                    withRelated: [{
                        posts: function (query) {
                            query.where({'private': false})
                        }
                    }],
                    require: true
                });
        }
    }
);

module.exports = bookshelf.model('User', User);
