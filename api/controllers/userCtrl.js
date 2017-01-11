'use strict';

var express = require('express');
var fs = require('fs');
var router = express.Router();

var User = require('../models/user');
var auth = require('../middleware/auth');
var sec = require('../middleware/security');
var validateReq = require('../middleware/validateReq');

/**
 * baseUrl: user/
 */

/**
 * other routes
 */
// router.post('/:id/changeUserRole',      sec.checkSUAccess(), changeUserRole());
// router.post('/checkNameAvailability',   checkNameAvailability());
// router.post('/checkEmailAvailability',  checkEmailAvailability());

/**
 * related routes
 */
// router.get('/:id/getAllMixPosts',       auth.checkToken(), sec.checkAccessById(), getAllMixPosts());
// router.get('/:id/getAllPubPosts',       getAllPubPosts());

/**
 * base routes
 */
router.get('/all',                      getAllUsers());
router.get('/:id',                      getUser());
router.post('/',                        auth.hashPassword(), makeNewUser());
router.put('/:id',                      update()); // auth.checkToken(), sec.checkAccessById(), auth.hashPassword(),
router.delete('/:id',                   remove()); // auth.checkToken(), sec.checkAccessById(),

/**
 * ------------------------------
 * description: get all Users
 * ------------------------------
 * url: user/all
 * method: GET
 */
function getAllUsers() {
    return function (req, res) {
        User.getAll()
            .then(function (list) {
                res.json({success: true, data: list});
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

// /**
//  * ------------------------------
//  * description: show list of mix(PUBLIC and PRIVATE) Posts of current User
//  * Id takes from TOKEN in AUTH middleware(checkToken method)
//  * ------------------------------
//  * url: user/getAllMixPosts
//  * headers: token
//  * method: GET
//  */
// function getAllMixPosts() {
//     return function (req, res) {
//         User.getAllMixPosts(req.body.helpData.userId)
//             .then(function (list) {
//                 res.json({success: true, data: list.related('posts')});
//             }).catch(function (error) {
//                 res.status(404).send({success: false, description: error});
//             });
//     }
// }

// /**
//  * ------------------------------
//  * description: show list of all PUBLIC Posts of current User
//  * ------------------------------
//  * url: user/user_id/getAllPublicPosts
//  * method: GET
//  */
// function getAllPubPosts() {
//     return function (req, res) {
//         User.getAllPubPosts(req.params.id)
//             .then(function (list) {
//                 res.json({success: true, data: list.related('posts')});
//             }).catch(function (error) {
//                 res.status(404).send({success: false, description: error});
//             });
//     }
// }

/**
 * ------------------------------
 * description: create new User(Registration)
 * ------------------------------
 * url: user/
 * method: POST
 * request: {"name": "string", "email": "string", "password": "string"}
 * "password" field from request transfers and saves to DB as "password_hash"
 */
function makeNewUser() {
    return function (req, res) {
        delete req.body.helpData;
        User.create(req.body)
            .then(function (user) {
                res.json(user);
            }).catch(function (error) {
                res.status(400).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: get User by id
 * ------------------------------
 * url: user/:id
 * method: POST
 */
function getUser() {
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (user) {
                res.json({success: true, data: user});
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: update User by id
 * ------------------------------
 * url: user/:id
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
            }).then(function (updated_user) {
                res.json({success: true, data: updated_user});
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: remove User from db by id
 * ------------------------------
 * url: user/:id
 * method: DELETE
 */
function remove() {
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (model) {
                return User.remove(model.id);
            }).then(function () {
                res.json({success: true, description: 'User with id '+ req.params.id +' was removed'});
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            })
    }
}

// /**
//  * ------------------------------
//  * description: check User name availability
//  * ------------------------------
//  * url: user/checkNameAvailability
//  * method: POST
//  * request: {"name": "string"}
//  * response: true if found, false if not found
//  */
// function checkNameAvailability() {
//     return function (req, res) {
//         User.getByName(req.body.name)
//             .then(function (user) {
//                 res.json({success: true});
//             }).catch(function (error) {
//                 res.status(404).send({success: false, description: error});
//             });
//     }
// }

// /**
//  * ------------------------------
//  * description: check User email availability
//  * ------------------------------
//  * url: user/checkEmailAvailability
//  * method: POST
//  * request: {"email": "string"}
//  * response: true if found, false if not found
//  */
// function checkEmailAvailability() {
//     return function (req, res) {
//         User.getByEmail(req.body.email)
//             .then(function (user) {
//                 res.json({success: true, data: user});
//             }).catch(function (error) {
//                 res.status(404).send({success: false, description: error});
//             });
//     }
// }

// function changeUserRole() {
//     return function (req, res) {
//         res.json({success: true});
//     }
// }

module.exports = router;
