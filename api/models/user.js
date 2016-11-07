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

    // initialize: function() {
    //     this.on('fetched', this.validate);
    // },

    // validate: function () {
        // console.log('model validation!!!!!');
        // console.log(this.get('name'));
    // }

}, {
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

        create: function(data) {
            return this.forge(data).save();
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
