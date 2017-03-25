'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const auth = require('../middleware/auth');
const sec = require('../middleware/security');

/**
 * ------------------------------
 * @BASE_URL: users/
 * ------------------------------
 */

/**
 * ------------------------------
 * @OTHER_ROUTES
 * ------------------------------
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
 * ------------------------------
 * @RELATED_ROUTES
 * ------------------------------
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
router.patch('/:id',
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
 * @CONTROLLERS
 * ------------------------------
 */

/**
 * @description get all Users
 * @url GET: users/
 * @hasaccess All
 */
function getAllUsers() {
    return function (req, res) {
        User.GETall()
            .then(function (list) {
                res.json({ success: true, data: list });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

/**
 * @description show Posts list by user ID
 * @url GET: users/user_id/posts/
 * @headers token
 * @hasaccess Owner >> response with public and private posts list
 * @hasaccess Anonymous, NotOwner >> response only with public posts
 */
function getPostsByUserId() {
    return function (req, res) {
        User.GETById(req.params.id)
            .then(function (user) {
                if ( req.body.helpData.isOwner ) return User.getMixPostsByUserId(user.id);
                return User.getPubPostsByUserId(user.id);
            })
            .then(function (list) {
                res.json({ success: true, data: list });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

/**
 * @description create new User(Registration)
 * @url POST: users/
 * @hasaccess only Anonymous
 * @request {"name": "string", "email": "string", "password": "string"}
 * "password" field from request transfers and saves to DB as "password_hash"
 */
function newUser() {
    return function (req, res) {
        delete req.body.helpData;
        User.CREATE(req.body)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

/**
 * @description get User by id
 * @url POST users/:id
 * @hasaccess Owner >> response with all profile data
 * @hasaccess Anonymous, NotOwner >> response only public profile data TODO
 */
function getUser() {
    return function (req, res) {
        User.GETbyId(req.params.id)
            .then(function (user) {
                res.json({ success: true, data: user });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

/**
 * @description update User by id
 * @url PATCH users/:id
 * @hasaccess OWNER, ADMINROLES
 * @request {"name": "string", "email": "string", "password": "string"}
 * "password" field from request transfers and saves to DB as "password_hash"
 */
function update() {
    return function (req, res) {
        User.GETbyId(req.params.id)
            .then(function (user) {
                delete req.body.helpData;
                return User.UPDATE(user.id, req.body);
            })
            .then(function (updated_user) {
                res.json({ success: true, data: updated_user });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

/**
 * @description remove User from db by id
 * @url DELETE: users/:id
 * @hasaccess OWNER, ADMINROLES
 */
function remove() {
    return function (req, res) {
        User.GETbyId(req.params.id)
            .then(function (model) {
                return User.REMOVE(model.id);
            })
            .then(function () {
                res.json({ success: true, description: 'User #'+ req.params.id +' was removed' });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

/**
 * @description check User name availability
 * @url GET: users/check-name-availability?q=string
 * @hasaccess: All
 */
function checkNameAvailability() {
    return function (req, res) {
        User.getByName(req.query.q)
            .then(function (user) {
                res.json({ success: true, data: user });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

/**
 * @description check User email availability
 * @url POST: users/check-email-availability?q=string
 * @hasaccess All
 */
function checkEmailAvailability() {
    return function (req, res) {
        User.getByEmail(req.query.q)
            .then(function (user) {
                res.json({ success: true, data: user });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

/**
 * @description change User Role
 * @url POST: users/:id/change-user-role',
 * @hasaccess SU
 * @request {user_id: "role"}
 */
// function changeUserRole() { // TODO
//     return function (req, res) {
//         res.json({success: true});
//     }
// }

module.exports = router;
