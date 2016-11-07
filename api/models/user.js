'use strict';

var Promise = require('bluebird');
var bookshelf = require('../config/db').bookshelf;
require('./post');

var User = bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true,
    posts: function() {
        return this.hasMany('Post');
    },

    initialize: function() {
        this.on('fetched', this.validate);
    },

    validate: function () {
        // console.log('model validation!!!!!');
        // console.log(this.get('name'));
    }

}, {
        getById: Promise.method(function(value) {
            if (value) {
                return this.forge().where('id', value).fetch();
            } else {
                throw new Error('Bad Request. Required {"id" : "value"} object in request is incorrect');
            }
        }),

        getByName: Promise.method(function(value) {
            if (value) {
                    return this.forge().where('name', value).fetch();
                } else {
                    throw new Error('Bad Request. Required {"name" : "value"} object in request is incorrect');
                }
        }),

        create: Promise.method(function(data) {
            new User({
                    name: data.name,
                    email: data.email
                })
                .save()
                .then(function(model) {
                    console.log(model.serialize())
                })
                .catch(function (error) {
                    throw new Error(error);
                });
        })
    }
);

module.exports = bookshelf.model('User', User);
