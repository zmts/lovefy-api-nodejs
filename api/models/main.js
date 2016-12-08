'use strict';

var bookshelf = require('../config/db').bookshelf;
var Promise = require('bluebird');

/**
 * description: Main parent model
 * extends other models by own basic methods
 */

var MainModel = bookshelf.Model.extend({},
    {
        getAll: Promise.method(function () {
            return this.forge().orderBy('id').fetchAll({require: true});
        }),

        create: Promise.method(function (data) {
            return this.forge(data).save()
        }),

        getById: Promise.method(function (id) {
            return this.forge().where('id', id).fetch({require: true});
        }),

        update: Promise.method(function (id, data) {
            return this.forge({id: id}).save(data);
        }),

        remove: Promise.method(function (id) {
            return this.forge({id: id}).destroy();
        })
    }
);

module.exports = bookshelf.model('MainModel', MainModel);
