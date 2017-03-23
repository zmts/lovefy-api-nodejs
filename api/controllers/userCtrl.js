'use strict';

var express = require('express');
var router = express.Router();

var User = require('../models/user');
var auth = require('../middleware/auth');
var sec = require('../middleware/security');

/**
 * ------------------------------
 * @BASE_URL: users/
 * ------------------------------
 */

/**
 * @OTHER_ROUTES
 */
// router.post('/:id/change-user-role',
//     sec.checkSUAccess(),
//     changeUserRole()
// );
router.get('/check-name-availability',
    checkNameAvailability()
);
router.get('/check-email-availability',
    checkEmailAvailability()
);

/**
 * @RELATED_ROUTES
 */
router.get('/:id/posts/',
    auth.checkToken(),
    sec.checkOwnerIdInParams(),
    getPostsByUserId()
);

/**
 * @BASE_ROUTES
 */
router.get('/',
    getAllUsers()
);
router.get('/:id',
    getUser()
);
router.post('/',
    auth.hashPassword(),
    newUser()
);
router.put('/:id',
    auth.checkToken(),
    sec.checkUserProfileAccess(),
    auth.hashPassword(),
    update()
);
router.delete('/:id',
    auth.checkToken(),
    sec.checkUserProfileAccess(),
    remove()
);

/**
 * ------------------------------
 * @description: get all Users
 * ------------------------------
 * @url: users/
 * @verb: GET
 * @hasaccess: All
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
    };
}

/**
 * ------------------------------
 * @description: show Posts list by user ID
 * ------------------------------
 * @url: users/user_id/posts/
 * @headers: token
 * @verb: GET
 * @hasaccess: Owner >> response with public and private posts list
 * @hasaccess: Anonymous, NotOwner >> response only with public posts
 */
function getPostsByUserId() {
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (user) {
                if ( req.body.helpData.isOwner ) return User.getMixPostsByUserId(user.id);
                return User.getPubPostsByUserId(user.id);
            })
            .then(function (list) {
                res.json({success: true, data: list});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error.message || error});
            });
    };
}

/**
 * ------------------------------
 * @description: create new User(Registration)
 * ------------------------------
 * @url: users/
 * @hasaccess: only Anonymous
 * @verb: POST
 * @request: {"name": "string", "email": "string", "password": "string"}
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
    };
}

/**
 * ------------------------------
 * @description: get User by id
 * ------------------------------
 * @url: users/:id
 * @verb: POST
 * @hasaccess: Owner >> response with all profile data
 * @hasaccess: Anonymous, NotOwner >> response only public profile data TODO
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
    };
}

/**
 * ------------------------------
 * @description: update User by id
 * ------------------------------
 * @url: users/:id
 * @hasaccess: Owner, ADMINROLES
 * @verb: PUT
 * @request: {"name": "string", "email": "string", "password": "string"}
 * "password" field from request transfers and saves to DB as "password_hash"
 */
function update() {
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (user) {
                delete req.body.helpData;
                return User.update(user.id, req.body);
            })
            .then(function (updated_user) {
                res.json({success: true, data: updated_user});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error.message || error});
            });
    };
}

/**
 * ------------------------------
 * @description: remove User from db by id
 * ------------------------------
 * @url: users/:id
 * @verb: DELETE
 * @hasaccess: Owner, ADMINROLES
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
            });
    };
}

/**
 * ------------------------------
 * @description: check User name availability
 * ------------------------------
 * @url: users/check-name-availability?q=string
 * @verb: GET
 * @hasaccess: All
 */
function checkNameAvailability() {
    return function (req, res) {
        User.getByName(req.query.q)
            .then(function (user) {
                res.json({success: true, data: user});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error.message || error});
            });
    };
}

/**
 * ------------------------------
 * @description: check User email availability
 * ------------------------------
 * @url: users/check-email-availability?q=string
 * @verb: POST
 * @hasaccess: All
 */
function checkEmailAvailability() {
    return function (req, res) {
        User.getByEmail(req.query.q)
            .then(function (user) {
                res.json({success: true, data: user});
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({success: false, description: error.message || error});
            });
    };
}

/**
 * ------------------------------
 * @description: change User Role
 * ------------------------------
 * @url: users/:id/change-user-role',
 * @verb: POST
 * @hasaccess: SU
 * @request: {user_id: "role"}
 */
// function changeUserRole() { // TODO
//     return function (req, res) {
//         res.json({success: true});
//     }
// }

module.exports = router;
