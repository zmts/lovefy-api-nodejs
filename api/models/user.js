'use strict';

var Promise = require('bluebird'),
    Joi = require('joi'),
    bookshelf = require('../config/db').bookshelf;
require('./post');

var validationSchema = Joi.object().keys({
    id: Joi.number().integer(),
    name: Joi.string().alphanum().min(4).max(30).required(),
    email: Joi.string().email().min(10).max(30).required(),
    created_at: Joi.date(),
    updated_at: Joi.date()
});

var User = bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true,
    posts: function() {
        return this.hasMany('Post');
    },

    initialize: function() {
        // this.on('fetched', this.validate);
        this.on('saving', this.validate);
    },

    validate: function () {
        return Joi.validate(this.serialize(), validationSchema, function (err, value) {
            if (err) {
                throw {success: false, message: err.name, details: err.details};
            }
        });
    }

}, {
        create: function(data) {
            return this.forge(data).save();
        },

        getById: function (id) {
            return this.forge().where('id', id).fetch();
        },

        getByName: Promise.method(function(name) {
            if (name) {
                    return this.forge().where('name', name).fetch();
                } else {
                    throw new Error('Bad Request. Required {"name" : "value"} object in request is incorrect');
                }
        }),

        getPosts: function (id) {
            return this.forge().where('id', id).fetch({withRelated: ['posts']});
        },

        update: function(id, data) {
            return this.forge({id: id}).save(data);
        },

        remove: function (id) {
            return this.forge({id: id}).destroy();
        }
    }
);

module.exports = bookshelf.model('User', User);
