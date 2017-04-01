'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const auth = require('../middleware/auth');
const sec = require('../middleware/security');

/**
 * ------------------------------------------------------------
 * @BASE_URL: users/
 * ------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------
 * @OTHER_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description change User Role
 * @hasaccess SU
 * @request {user_id: "role"}
 */
// router.post('/:id/change-user-role',
//     sec.checkSUAccess(),
//     changeUserRole()
// );

/**
 * @description check User name availability
 * @hasaccess: All
 */
router.get('/check-name-availability',
    checkNameAvailability()
);

/**
 * @description check User email availability
 * @hasaccess All
 */
router.get('/check-email-availability',
    checkEmailAvailability()
);

/**
 * ------------------------------------------------------------
 * @RELATED_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description get POST's by user_id
 * @return OWNER >> all mix POST's by :user_id
 * @return not OWNER >> all public POST's by user_id
 */
router.get('/:id/posts/',
    auth.checkToken(),
    sec.isOwnerIdInParams(),
    getPostsByUserId()
);

/**
 * @description get ALBUM's by user_id
 * @return OWNER >> all mix ALBUM's by :user_id
 * @return not OWNER >> all public ALBUM's by user_id
 */
router.get('/:id/albums/',
    auth.checkToken(),
    sec.isOwnerIdInParams(),
    getAlbumsByUserId()
);

/**
 * ------------------------------------------------------------
 * @BASE_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description get all Users
 * @url GET: users/
 * @hasaccess All
 */
router.get('/',
    getAllUsers()
);

/**
 * @return Owner >> all profile data
 * @return Anonymous or NotOwner >> only public profile data TODO
 */
router.get('/:id',
    getUser()
);

/**
 * @description create new User(Registration)
 * @hasaccess only Anonymous
 * @return new USER model
 * @request { [name: string], [email: string], [password: string] }
 * "password" field from request transfers and saves to DB as "password_hash"
 */
router.post('/',
    auth.hashPassword(),
    newUser()
);

/**
 * @description update User by id
 * @hasaccess OWNER, ADMINROLES
 * @request {"name": "string", "email": "string", "password": "string"}
 * "password" field from request transfers and saves to DB as "password_hash"
 */
router.patch('/:id',
    auth.checkToken(),
    sec.checkOwnerIdInParams(),
    auth.hashPassword(),
    update()
);

/**
 * @description remove User from db by id
 * @hasaccess OWNER, ADMINROLES
 */
router.delete('/:id',
    auth.checkToken(),
    sec.checkOwnerIdInParams(),
    remove()
);

/**
 * ------------------------------------------------------------
 * @CONTROLLERS
 * ------------------------------------------------------------
 */

function getAllUsers() {
    return function (req, res, next) {
        User.GETall()
            .then(function (list) {
                res.json({ success: true, data: list });
            }).catch(next);
    };
}

function getPostsByUserId() {
    return function (req, res, next) {
        User.GETbyId(req.params.id)
            .then(function () {
                if (req.body.helpData.isOwner) return User.GetMixPostsByUserId(req.params.id);
                return User.GetPubPostsByUserId(req.params.id);
            })
            .then(function (list) {
                res.json({ success: true, data: list });
            }).catch(next);
    };
}

function getAlbumsByUserId() {
    return function (req, res, next) {
        User.GETbyId(req.params.id)
            .then(function () {
                if (req.body.helpData.isOwner) return User.GetMixAlbumsByUserId(req.params.id);
                return User.GetPubAlbumsByUserId(req.params.id);
            })
            .then(function (list) {
                res.json({ success: true, data: list });
            }).catch(next);
    };
}

function newUser() {
    return function (req, res, next) {
        delete req.body.helpData;
        User.CREATE(req.body)
            .then(function (user) {
                res.json(user);
            }).catch(next);
    };
}

function getUser() {
    return function (req, res, next) {
        User.GETbyId(req.params.id)
            .then(function (user) {
                res.json({ success: true, data: user });
            }).catch(next);
    };
}

function update() {
    return function (req, res, next) {
        delete req.body.helpData;
        User.UPDATE(req.params.id, req.body)
            .then(function (updated_user) {
                res.json({ success: true, data: updated_user });
            }).catch(next);
    };
}

function remove() {
    return function (req, res, next) {
        User.REMOVE(req.params.id)
            .then(function () {
                res.json({ success: true, description: 'User #'+ req.params.id +' was removed' });
            }).catch(next);
    };
}

function checkNameAvailability() {
    return function (req, res, next) {
        User.GetByName(req.query.q)
            .then(function (user) {
                res.json({ success: true, data: user });
            }).catch(next);
    };
}

function checkEmailAvailability() {
    return function (req, res, next) {
        User.GetByEmail(req.query.q)
            .then(function (user) {
                res.json({ success: true, data: user });
            }).catch(next);
    };
}

// function changeUserRole() { // TODO
//     return function (req, res) {
//         res.json({success: true});
//     }
// }

module.exports = router;
