'use strict';

var bookshelf = require('../config/db').bookshelf;
require('./post');

var User = bookshelf.Model.extend({
    tableName: 'users',
    posts: function() {
        return this.hasMany('Post');
    }
});

module.exports = bookshelf.model('User', User);
