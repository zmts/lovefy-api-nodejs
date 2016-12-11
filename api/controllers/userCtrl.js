'use strict';

var express = require('express');
var fs = require('fs');
var router = express.Router();

var User = require('../models/user');
var auth = require('../middleware/auth');
var validateReq = require('../middleware/validateReq');

/**
 * baseUrl: user/
 */
router.post('/checkNameAvailability',   checkNameAvailability());
router.post('/checkEmailAvailability',  checkEmailAvailability());

router.post('/getAllUsers',         getAllUsers());
router.post('/getCurrentUserPosts', auth.checkToken(), getCurrentUserPosts()); // Show list of all posts by Current user

router.use('/:id',                  validateReq.id());

router.post('/:id/getPublicPosts',  getPublicPosts()); // show all Public posts by Id // todo
router.post('/',                    auth.hashPassword(), makeNewUser());
router.post('/:id',                 getUser());
router.put('/:id',                  update());
router.delete('/:id',               remove());

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
                res.status(400).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: show list of all Posts of current User Id
 * Id takes from token in auth middleware(checkToken method)
 * ------------------------------
 * url: user/getCurrentUserPosts
 * headers: token
 * method: POST
 */
function getCurrentUserPosts() {
    return function (req, res) {
        User.getPosts(req.body.userId)
            .then(function (list) {
                res.json({success: true, data: list.related('posts')});
            }).catch(function (error) {
                res.status(400).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: show list of all PUBLIC Posts related by User id
 * ------------------------------
 * url: user/user_id/getPublicPosts
 * method: POST
 */
function getPublicPosts() { // todo: method MUST response only with {'private': false} attribute
    return function (req, res) {
        User.getPublicPosts(req.params.id)
            .then(function (list) {
                res.json({success: true, data: list.related('posts')});
            }).catch(function (error) {
                res.status(400).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: create new User(Registration)
 * ------------------------------
 * url: user/
 * method: POST
 * request: {"name": "string", "email": "string", "password_hash": "string"}
 */
function makeNewUser() {
    return function (req, res) {
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
 * request: {"name": "string", "email": "string"}
 */
function update() {
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (user) {
                User.update(user.id, req.body)
                    .then(function (updated_user) {
                        res.json({success: true, data: updated_user});
                    }).catch(function (error) {
                        res.status(400).send({success: false, description: error});
                    });
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
                User.remove(model.id)
                    .then(function () {
                        res.json({success: true, description: 'User id ' + model.id + ' was removed'});
                    }).catch(function (error) {
                        res.status(400).send({success: false, description: error});
                    });
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: check User name availability
 * ------------------------------
 * url: user/checkNameAvailability
 * method: POST
 * request: {"name": "string"}
 * response: true if found, false if not found
 */
function checkNameAvailability() {
    return function (req, res) {
        User.getByName(req.body.name)
            .then(function (user) {
                res.json({success: true});
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: check User email availability
 * ------------------------------
 * url: user/checkEmailAvailability
 * method: POST
 * request: {"email": "string"}
 * response: true if found, false if not found
 */
function checkEmailAvailability() {
    return function (req, res) {
        User.getByEmail(req.body.email)
            .then(function (user) {
                res.json({success: true});
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

module.exports = router;
