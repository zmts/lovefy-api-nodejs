'use strict';

var Promise = require('bluebird');
var Joi = require('joi');
var MainModel = require('./main');
var bookshelf = require('../config/db').bookshelf;

require('./post');

var validationSchema = Joi.object().keys({
    id: Joi.number().integer(),
    name: Joi.string().min(4).max(30).required(),
    email: Joi.string().email().min(10).max(30).required(),
    password_hash: Joi.string().required(),
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

    initialize: function() {
        // this.on('fetching', this.validate);
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
        getByName: Promise.method(function(name) {
            if (name) { return this.forge().where('name', name).fetch({require: true}) }
            throw ('Bad Request. Required {"name" : "value"} object in request is incorrect');
        }),

        getByEmail: Promise.method(function(email) {
            if (email) { return this.forge().where('email', email).fetch({require: true}) }
            throw ('Bad Request. Required {"email" : "value"} object in request is incorrect');
        }),

        getPosts: function (id) {
            return this.forge().where('id', id).fetch({withRelated: ['posts'], require: true});
        }
    }
);

module.exports = bookshelf.model('User', User);
