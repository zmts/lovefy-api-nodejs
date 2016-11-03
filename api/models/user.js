'use strict';

var bookshelf = require('../config/db').bookshelf;
require('./post');

var User = bookshelf.Model.extend({
    tableName: 'users',
    posts: function() {
        return this.hasMany('Post');
    },

    get: function () {
        return this.fetchAll();
    }
},
    {
        Get: function () {
            return this.forge().fetchAll();
        },

        AnotherStaticMethod: function () {
            console.log('AnotherStaticMethod');
        }

    }
);

module.exports = bookshelf.model('User', User);
