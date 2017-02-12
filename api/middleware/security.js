'use strict';

var SUPERUSER = require('../config').roles.superuser;
var ADMINROLES = require('../config').roles.adminRoles;
var EDITORROLES = require('../config').roles.editorRoles;

/**
 * ------------------------------
 * description: check Authorization status
 * ------------------------------
 */
module.exports.isAuth = function () {
    return function (req, res, next) {
        if ( +req.body.helpData.userId ) return next();
        res.status(403).send({
            success: false,
            description: 'Forbidden. User is not authorized to access this resource'
        });
    }
};

/**
 * ------------------------------
 * description: check SUPERUSER permission
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
 * description: check access to User profile
 * if ID from token === ID from params
 * ------------------------------
 * have full access: ADMINROLES, OWNER
 * @required: 'auth.checkToken' middleware
 */
module.exports.checkUserProfileAccess = function () {
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
module.exports.checkItemAccess = {

    read: function (modelName) {
        return function (req, res, next) {
            if ( req.method === 'GET' ) {
                modelName.getById(req.params.id)
                    .then(function (model) {
                        if ( !model.private ) return next();
                        if ( ADMINROLES.indexOf( req.body.helpData.userRole ) >= 0 ) return next();
                        if ( +req.body.helpData.userId === +model.user_id ) return next(); // check owner access
                        res.status(403).send({
                            success: false,
                            description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.params.id
                        });
                    })
                    .catch(function (error) {
                        res.status(404).send({success: false, description: error});
                    });
            }
        }
    },

    create: function () {
        return function (req, res, next) {
            if ( req.method === 'POST' ) {
                if ( ADMINROLES.indexOf( req.body.helpData.userRole ) >= 0 ) return next();
                if ( +req.body.helpData.userId === +req.body.user_id ) return next(); // check owner access
                res.status(403).send({
                    success: false,
                    description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.body.user_id
                });
            }
        }
    },

    update: function (modelName) {
        return function (req, res, next) {
            if ( req.method === 'PUT' ) {
                modelName.getById(req.params.id)
                    .then(function (model) {
                        if ( ADMINROLES.indexOf( req.body.helpData.userRole ) >= 0 ) return next();
                        // check owner access // forbid to User change Item 'user_id'
                        if ( +req.body.helpData.userId === (+model.user_id && +req.body.user_id) ) return next();
                        // handle error if User not Item owner
                        else if ( +req.body.helpData.userId !== +model.user_id ) {
                            res.status(403).send({
                                success: false,
                                description: 'Forbidden. userId(' + req.body.helpData.userId + ') to item#' + req.params.id
                            });
                        }
                        // handle error if User try change Item user_id
                        else if ( +req.body.helpData.userId !== +req.body.user_id ) {
                            res.status(403).send({
                                success: false,
                                description: 'Forbidden change \'user_id\'. For item#' + req.params.id + ' \'user_id\' must be #' + req.body.helpData.userId
                            });
                        }
                    })
                    .catch(function (error) {
                        res.status(404).send({success: false, description: error});
                    });
            }
        }
    },

    remove: function (modelName) {
        return function (req, res, next) {
            if ( req.method === 'DELETE' ) {
                modelName.getById(req.params.id)
                    .then(function (model) {
                        if ( ADMINROLES.indexOf( req.body.helpData.userRole ) >= 0 ) return next();
                        if ( +req.body.helpData.userId === +model.user_id ) return next(); // check owner access
                        res.status(403).send({
                            success: false,
                            description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.params.id
                        });
                    })
                    .catch(function (error) {
                        res.status(404).send({success: false, description: error});
                    });
            }
        }
    }
};
