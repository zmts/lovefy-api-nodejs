'use strict';

var bookshelf = require('../config/db').bookshelf;

var Post = bookshelf.Model.extend({
    tableName: 'posts'
});

module.exports = bookshelf.model('Post', Post);
