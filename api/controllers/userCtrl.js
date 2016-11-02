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

module.exports.checkNameAvailability = function() {
    return function(req, res) {
        User.forge()
            .where('name', req.body.name)
            .fetch()
            .then(function(model) {
                if (model) {
                    res.json({success: true});
                } else {
                    res.json({success: false});
                }
            })
            .catch(function(error) {
                res.send(error);
            });
    }
};

// bad implementation >> =) >>
// module.exports.checkNameAvailability = function() {
//     return function(req, res) {
//         User.forge()
//             .fetchAll()
//             .then(function (users) {
//                 var data = users.serialize();
//
//                 var that = this;
//                 that.availabilityStatus = {success: true};
//
//                 _.forEach(data, function (user) {
//                     if (user.name === req.body.name){
//                         that.availabilityStatus.success = false;
//                     }
//                 })
//                 res.json(that.availabilityStatus);
//             }).catch(function (error) {
//             console.log(error)
//         });
//     }
// };

