'use strict';

var express = require('express');
var fs = require('fs');
var router = express.Router();

var User = require('../models/user');
var auth = require('../middleware/auth');
var sec = require('../middleware/security');
var validateReq = require('../middleware/validateReq');

/**
 * baseUrl: users/
 */

/**
 * other routes
 */
// router.post('/:id/changeUserRole',      sec.checkSUAccess(), changeUserRole());
router.post('/checkNameAvailability',   checkNameAvailability());
router.post('/checkEmailAvailability',  checkEmailAvailability());

/**
 * related routes
 */
router.get('/:id/posts/',             auth.checkToken(), sec.checkOwner(), getPostsById());

/**
 * base routes
 */
router.get('/all',                      getAllUsers());
router.get('/:id',                      getUser());

router.post('/',                        auth.hashPassword(), newUser());
router.put('/:id',                      auth.checkToken(), sec.checkUserProfileAccess(), auth.hashPassword(), update());
router.delete('/:id',                   auth.checkToken(), sec.checkUserProfileAccess(), remove());

/**
 * ------------------------------
 * description: get all Users
 * ------------------------------
 * url: users/all
 * method: GET
 */
function getAllUsers() {
    return function (req, res) {
        User.getAll()
            .then(function (list) {
                res.json({success: true, data: list});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error.message || error});
            });
    }
}

/**
 * ------------------------------
 * description: show Posts list by user ID
 * if user is Owner response with public and private posts list
 * else response only with public posts
 * ------------------------------
 * url: users/user_id/posts/
 * headers: token
 * method: GET
 */
function getPostsById() {
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (user) {
                if ( req.body.helpData.isOwner ) return User.getMixPostsById(user.id);
                return User.getPubPostsById(user.id);
            })
            .then(function (list) {
                res.json({success: true, data: list});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error.message || error});
            });
    }
}

/**
 * ------------------------------
 * description: create new User(Registration)
 * ------------------------------
 * url: users/
 * method: POST
 * request: {"name": "string", "email": "string", "password": "string"}
 * "password" field from request transfers and saves to DB as "password_hash"
 */
function newUser() {
    return function (req, res) {
        delete req.body.helpData;
        User.create(req.body)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error.message || error});
            });
    }
}

/**
 * ------------------------------
 * description: get User by id
 * ------------------------------
 * url: users/:id
 * method: POST
 */
function getUser() {
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (user) {
                res.json({success: true, data: user});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error.message || error});
            });
    }
}

/**
 * ------------------------------
 * description: update User by id
 * ------------------------------
 * url: users/:id
 * method: PUT
 * request: {"name": "string", "email": "string", "password": "string"}
 * "password" field from request transfers and saves to DB as "password_hash"
 */
function update() {
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (user) {
                delete req.body.helpData;
                return User.update(user.id, req.body)
            })
            .then(function (updated_user) {
                res.json({success: true, data: updated_user});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error.message || error});
            });
    }
}

/**
 * ------------------------------
 * description: remove User from db by id
 * ------------------------------
 * url: users/:id
 * method: DELETE
 */
function remove() {
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (model) {
                return User.remove(model.id);
            })
            .then(function () {
                res.json({success: true, description: 'User #'+ req.params.id +' was removed'});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error.message || error});
            })
    }
}

/**
 * ------------------------------
 * description: check User name availability
 * ------------------------------
 * url: users/checkNameAvailability
 * method: POST
 * request: {"name": "string"}
 * response: true if found, false if not found
 */
function checkNameAvailability() {
    return function (req, res) {
        User.getByName(req.body.name)
            .then(function (user) {
                res.json({success: true, data: user});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error.message || error});
            });
    }
}

/**
 * ------------------------------
 * description: check User email availability
 * ------------------------------
 * url: users/checkEmailAvailability
 * method: POST
 * request: {"email": "string"}
 * response: true if found, false if not found
 */
function checkEmailAvailability() {
    return function (req, res) {
        User.getByEmail(req.body.email)
            .then(function (user) {
                res.json({success: true, data: user});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error.message || error});
            });
    }
}

// function changeUserRole() {
//     return function (req, res) {
//         res.json({success: true});
//     }
// }

module.exports = router;
