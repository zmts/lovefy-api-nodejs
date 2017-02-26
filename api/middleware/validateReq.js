var _ = require('lodash');

module.exports.id = function () {
    return function (req, res, next) {
        if ( _.isNaN(+req.params.id) ) {
            return res.status(400).send({success: false, description: 'Invalid request param id >> ' + req.params.id});
        }
        next();
    };
};