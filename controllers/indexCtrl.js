"use strict"

module.exports.index = function() {
    return function(req, res, next) {
        res.end();
    }
}
