'use strict';

var Joi = require('joi');

var bookshelf = require('../config/db').bookshelf;
var MainModel = require('./main');

var validationSchema = Joi.object().keys({
    id: Joi.number().integer(),
    title: Joi.string().min(3).max(50).required(),
    content: Joi.string().min(3).max(5000).required(),
    created_at: Joi.date(),
    updated_at: Joi.date()
});

var Post = MainModel.extend({
    tableName: 'posts',
    hasTimestamps: true,

    initialize: function () {
        this.on('saving', this.validate);
        this.on('creating', this.validate);
    },

    validate: function () {
        return Joi.validate(this.serialize(), validationSchema, function (error, value) {
            if (error) { throw ({success: false, message: error.name, details: error.details}) }
        });
    }

},  {
        do: function () {
            console.log('lol')
        }
    }
);

module.exports = bookshelf.model('Post', Post);
