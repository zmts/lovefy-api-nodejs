'use strict';

var User = require('../models/user');
// var Post = require('../models/post');

module.exports.index = function() {
    return function(req, res, next) {
        User.where({ id: 2 })
            .fetch({
                withRelated: ['posts']
            })
            .then(function(model) {
                res.send(model.serialize());
                // res.send(model.get('name'));
            })
            .catch(function(error) {
                console.log(error);
                res.send('An error occured');
            });
    }
};
