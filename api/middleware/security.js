var SUPERUSER = require('../config').roles.superuser;
var ADMINROLES = require('../config').roles.adminRoles;
var EDITORROLES = require('../config').roles.editorRoles;
var USER = require('../config').roles.user;
var User = require('../models/user');

/**
 * description: check SUPERUSER permissions
 * SUPERUSER have access to any item
 */
module.exports.checkSUAccess = function () {
    return function (req, res, next) {
        if (req.body.helpData.userRole === SUPERUSER) { return next() }
        res.status(403).send({success: false, description: 'Forbidden. User(' + req.body.helpData.userId + ') dont have permissions to make actions at id #' + req.params.id});
    }
};

/**
 * description: check User model access
 * middleware uses before make some actions at User model
 * At User model can make some actions >> ADMINROLES and owner
 */
module.exports.checkProfileAccess = function () {
    return function (req, res, next) {
        if ( ADMINROLES.indexOf(req.body.helpData.userRole) >= 0 ) { return next() }
        if ( req.body.helpData.userId === req.params.id ) { return next() }
        res.status(403).send({success: false, description: 'Forbidden. User(' + req.body.helpData.userId + ') dont have permissions to make actions at id #' + req.params.id});
    }
};

/**
 * description: check Item model access
 * middleware uses before make some actions at Item model
 * In parameters(modelName) takes model that we want to modify
 * At item can make some actions >> ADMINROLES, EDITORROLES and owner
 */
module.exports.checkItemAccess = function (modelName) {
    return function (req, res, next) {
        modelName.getById(req.params.id)
            .then(function (model) {
                if ( ADMINROLES.indexOf(req.body.helpData.userRole ) >= 0) { return next() }
                if ( EDITORROLES.indexOf(req.body.helpData.userRole ) >= 0) { return next() }
                if ( +req.body.helpData.userId === +model.get('user_id') ) { return next() }
                res.status(403).send({success: false, description: 'Forbidden. User(' + req.body.helpData.userId + ') dont have permissions to make actions at id #' + req.params.id});
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });

    };
};
