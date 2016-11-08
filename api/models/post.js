'use strict';

var bookshelf = require('../config/db').bookshelf;

var Post = bookshelf.Model.extend({
    tableName: 'posts',

    initialize: function() {
        // this.on('fetched', this.validate);
        // this.on('saving', this.validate);
    }

}, {
        create: function(data) {
            return this.forge(data).save();
        },

        getById: function (id) {
            return this.forge().where('id', id).fetch();
        },

        update: function(id, data) {
            return this.forge({id: id}).save(data);
        },

        remove: function (id) {
            return this.forge({id: id}).destroy();
        }
    }
);

module.exports = bookshelf.model('Post', Post);
