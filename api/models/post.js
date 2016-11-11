'use strict';

var bookshelf = require('../config/db').bookshelf;
var MainModel = require('./main');

var Post = MainModel.extend({
    tableName: 'posts',
    hasTimestamps: true,

    initialize: function() {
        // this.on('fetched', this.validate);
        // this.on('saving', this.validate);
    }

},  {
        do: function () {
            console.log('lol')
        }
    }
);

module.exports = bookshelf.model('Post', Post);
