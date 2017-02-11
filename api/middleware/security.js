'use strict';

var SUPERUSER = require('../config').roles.superuser;
var ADMINROLES = require('../config').roles.adminRoles;
var EDITORROLES = require('../config').roles.editorRoles;
var USER = require('../config').roles.user;

var User = require('../models/user');

/**
 * ------------------------------
 * description: check SUPERUSER permissions
 * ------------------------------
 * have full access: SUPERUSER
 * @required: 'auth.checkToken' middleware
 */
module.exports.checkSUAccess = function () {
    return function (req, res, next) {
        if (req.body.helpData.userRole === SUPERUSER) return next();
        res.status(403).send({
            success: false,
            description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.params.id
        });
    }
};

/**
 * ------------------------------
 * description: grant access if ID from token === ID from params
 * ------------------------------
 * have full access: ADMINROLES, OWNER
 * @required: 'auth.checkToken' middleware
 */
module.exports.checkAccessById = function () {
    return function (req, res, next) {
        if ( ADMINROLES.indexOf( req.body.helpData.userRole ) >= 0 ) return next();
        if ( req.body.helpData.userId === req.params.id ) return next();
        res.status(403).send({
            success: false,
            description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.params.id
        });
    }
};

/**
 * ------------------------------
 * description: check access for Item model
 * ------------------------------
 * can read, update, remove: ADMINROLES, EDITORROLES, OWNER
 * can read only public items: ANONYMOUS
 * @param {object} modelName - model that we want to modify
 * @required: 'auth.checkToken' middleware
 */
module.exports.checkItemAccess = function (modelName) {
    return function (req, res, next) {
        modelName.getById(req.params.id)
            .then(function (model) {
                if ( !model.private ) return next();
                if ( ADMINROLES.indexOf( req.body.helpData.userRole ) >= 0) return next();
                if ( EDITORROLES.indexOf( req.body.helpData.userRole ) >= 0) return next();

                // user cant change 'user_id' field when update item
                if ( req.method === 'PUT' && +req.body.helpData.userId !== +req.body.user_id) {
                    return res.status(403).send({
                        success: false,
                        description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.body.user_id
                    });
                }

                // owner have access
                if ( +req.body.helpData.userId === +model.user_id ) return next();
                res.status(403).send({
                    success: false,
                    description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.params.id
                });
            })
            .catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
};

/**
 * ------------------------------
 * description: check access for create new Item model
 * ------------------------------
 * can create new item: ADMINROLES, EDITORROLES, OWNER
 * @required: 'auth.checkToken' middleware
 */
module.exports.checkItemCreateAccess = function () {
    return function (req, res, next) {
        console.log(req.body.helpData);
        if ( ADMINROLES.indexOf( req.body.helpData.userRole ) >= 0) return next();
        if ( +req.body.helpData.userId === +req.body.user_id ) return next(); // check Relationships
        res.status(403).send({
            success: false,
            description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.body.user_id
        });
    }
};

// module.exports.hasAccess = function (roles, modelName) {
//     return function (req, res, next) {
//         var roles = roles || ['admin', 'superuser'];
//         if ( roles.indexOf(req.body.helpData.userRole) || roles.indexOf(req.body.helpData.userId) >= 0 ) {
//
//             switch (req.method) {
//                 case 'GET':
//                     next();
//                     break;
//                 case 'POST':
//                     break;
//                 case 'PUT':
//                     break;
//                 case 'DELETE':
//                     break;
//                 default:
//                     res.status(403).send({
//                         success: false,
//                         description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.params.id || req.body.user_id
//                     });
//                     break;
//             }
//
//         }
//     }
// };


