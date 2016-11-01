'use strict';

const User = require('../models/user').User;

module.exports.index = function() {
    return function(req, res, next) {
        res.end();
    }
};
