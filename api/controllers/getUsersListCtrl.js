'use strict';

var User = require('../models/user');

module.exports.index = function() {
    return function(req, res) {
        User.forge()
            .fetchAll()
            .then(function(list) {
                // console.log(list.serialize())
                res.json(list);
            })
            .catch(function(error) {
                res.send(error);
            });
    }
};
