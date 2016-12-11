var _ = require('lodash');

module.exports.id = function () {
    return function (req, res, next) {
        if ( _.isNaN(+req.params.id) ) {
            return res.status(400).send({success: false, description: "Invalid request param id >> " + req.params.id});
        }
        next();
    }
};

// How to get all registered routes in Express?
// app._router.stack
// router.stack

// app._router.stack.forEach(function(r){
//     if (r.route && r.route.path){
//         console.log(r.route.path)
//     }
// })
