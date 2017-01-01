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
        if (req.body.helpData.userRole === SUPERUSER) { return next() }
        res.status(403).send({success: false, description: 'Forbidden. User(' + req.body.helpData.userId + ') dont have permissions to make actions at id #' + req.params.id});
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
        if ( ADMINROLES.indexOf( req.body.helpData.userRole) >= 0 ) { return next() }
        if ( req.body.helpData.userId === req.params.id ) { return next() }
        res.status(403).send({success: false, description: 'Forbidden. User(' + req.body.helpData.userId + ') dont have permissions to make actions at id #' + req.params.id});
    }
};

/**
 * ------------------------------
 * description: check read access for Item model
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
                if ( !model.get('private') ) { return next() }
                if ( ADMINROLES.indexOf( req.body.helpData.userRole ) >= 0) { return next() }
                if ( EDITORROLES.indexOf( req.body.helpData.userRole ) >= 0) { return next() }
                if ( +req.body.helpData.userId === +model.get('user_id') ) { return next() } // check Ownership
                res.status(403).send({success: false, description: 'Forbidden. User(' + req.body.helpData.userId + ') dont have permissions to make actions at id #' + req.params.id});
            }).catch(function (error) {
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
        if ( ADMINROLES.indexOf( req.body.helpData.userRole ) >= 0) { return next() }
        if ( EDITORROLES.indexOf( req.body.helpData.userRole ) >= 0) { return next() }
        if ( +req.body.helpData.userId === +req.body.user_id ) { return next() } // check Relationships
        res.status(403).send({success: false, description: 'Forbidden. User(' + req.body.helpData.userId + ') dont have permissions to create Items at id #' + req.body.user_id});
    }
};
