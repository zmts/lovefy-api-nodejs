'use strict';

var Promise = require('bluebird');
var bookshelf = require('../config/db').bookshelf;
require('./post');

var User = bookshelf.Model.extend({
    tableName: 'users',
    posts: function() {
        return this.hasMany('Post');
    }
}, {
        getName: Promise.method(function(value) {
            if (value) {
                    return this.forge().where('name', value).fetch();
                } else {
                    throw new Error('Bad Request. Required {"name" : "value"} object in request is incorrect');
                }
        })
    }
);

module.exports = bookshelf.model('User', User);
