'use strict';

var express = require('express'),
    fs = require('fs'),
    router = express.Router(),
    User = require('../models/user'),
    auth = require('../middleware/auth');

/**
 * baseUrl: user/
 */
router.get('/help',         help()); // Sends help route
router.get('/all',          readAll()); // Show list of all items
router.get('/:id/posts',    readPosts()); // Show list of all posts related by user id
router.post('/',            auth.hashPassword(), create()); // Create user
router.get('/:id',          read()); // Display item by id
router.put('/:id',          update()); // Update item details by id
router.delete('/:id',       remove()); // Delete item by id

/**
 * ------------------------------
 * description: User sign in system
 * ------------------------------
 * url: user/signin
 * method: POST
 * request: {"email": "string", password: "string"}
 */
router.post('/signin', auth.checkEmailAvailability(), auth.checkPassword(), auth.signIn());

/**
 * ------------------------------
 * description: User sign out system
 * ------------------------------
 * url: user/signout
 * method: POST
 * request: {"email": "string"}
 */
router.post('/signout', auth.signOut());

/**
 * ------------------------------
 * description: check User name availability
 * ------------------------------
 * url: user/checkNameAvailability
 * method: POST
 * request: {"name": "string"}
 * response: true if found, false if not found
 */
router.post('/checkNameAvailability', auth.checkNameAvailability(), function (req, res) {
    res.json({success: true, message: 'Found'});
});

/**
 * ------------------------------
 * description: check User email availability
 * ------------------------------
 * url: user/checkEmailAvailability
 * method: POST
 * request: {"email": "string"}
 * response: true if found, false if not found
 */
router.post('/checkEmailAvailability', auth.checkEmailAvailability(), function (req, res) {
    res.json({success: true, message: 'Found'});
});

/********** end routes **********/
/********** end routes **********/
/********** end routes **********/

/**
 * @api public
 * ------------------------------
 * description: help
 * ------------------------------
 * url: user/help
 * method: GET
 */
function help() {
    return function(req, res) {
        // var str = fs.readFileSync(__filename, 'utf8');
        res.send('User route help info');
    }
}

/**
 * ------------------------------
 * description: get all Users
 * ------------------------------
 * url: user/all
 * method: GET
 */
function readAll() {
    return function(req, res) {
        User.fetchAll({require: true})
            .then(function(list) {
                // console.log(list.serialize())
                res.json(list);
            })
            .catch(function(error) {
                res.status(400).send(error);
            });
    }
}

/**
 * ------------------------------
 * description: show list of all Posts related by User id
 * ------------------------------
 * url: user/user_id/posts
 * method: GET
 */
function readPosts() {
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (id) {
                if (id) {
                    User.getPosts(req.params.id)
                        .then(function (list) {
                            res.json({success: true, data: list.related('posts')});
                        })
                        .catch(function (error) {
                            res.status(400).send(error);
                        });
                } else {
                    res.status(404).json({success: false, error: "User id " + req.params.id + " not found"});
                }
            })
    }
}

/**
 * ------------------------------
 * description: create User
 * ------------------------------
 * url: user/
 * method: POST
 * request: {"name": "string", "email": "string"}
 */
function create() {
    return function(req, res) {
        User.create(req.body)
            .then(function (model) {
                res.json(model);
            })
            .catch(function (error) {
                res.status(400).send(error);
            });
    }
}

/**
 * ------------------------------
 * description: get User by id
 * ------------------------------
 * url: user/:id
 * method: GET
 */
function read() {
    return function(req, res) {
        User.getById(req.params.id)
            .then(function(user) {
                if (user){
                    res.json({success: true, data: user});
                } else {
                    res.status(404).json({success: false, error: "User id " + req.params.id + " not found"});
                }
            })
            .catch(function(error) {
                res.status(400).send(error);
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
    return function(req, res) {
        User.update(req.params.id, req.body)
            .then(function (model) {
                res.json(model);
            })
            .catch(function (error) {
                res.status(400).send(error.message);
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
    return function(req, res) {
        User.getById(req.params.id)
            .then(function (model) {
                if(model){
                    User.remove(req.params.id)
                        .then(function () {
                            res.json({success: true, message: 'User id ' + req.params.id + ' was removed'});
                        })
                        .catch(function(error) {
                            res.status(400).send(error);
                        });
                } else {
                    res.status(404).json({success: false, message: 'User id ' + req.params.id + ' not found'});
                }
            })
            .catch(function (error) {
                res.status(400).send(error);
            });
    }
}

module.exports = router;
