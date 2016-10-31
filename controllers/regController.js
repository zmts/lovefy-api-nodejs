'use strict';

module.exports.index = function() {
    return function(req, res, next) {
        res.render('reg');
    }
}

module.exports.new = function() {
    return function(req, res, next) {
        var data = {
            user: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        }
        res.send(data);
    }
}
