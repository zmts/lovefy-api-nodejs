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
        getField: Promise.method(function(fieldName, fieldValue) {
            if (fieldName && fieldValue) {
                    return this.forge().where(fieldName, fieldValue).fetch();
                } else {
                    throw new Error('fieldName and fieldValue are both required');
                }
        })
    }
);

module.exports = bookshelf.model('User', User);
