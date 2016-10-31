'use strict';

const User = require('../models/user').User;
const _ = require('lodash');

module.exports.index = function() {
    return function(req, res, next) {
        res.render('new');
    }
};
