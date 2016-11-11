'use strict';

var bookshelf = require('../config/db').bookshelf;

/**
 * description: Main parent model
 * extends other models by own basic methods
 */
var MainModel = bookshelf.Model.extend({}, {

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

module.exports = bookshelf.model('MainModel', MainModel);

