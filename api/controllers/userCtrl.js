'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const auth = require('../middleware/auth');
const sec = require('../middleware/security');
const upload = require('../middleware/upload');
const validate = require('../middleware/validateReq');
const emailService = require('../services/email');

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
 * @request {role: "user" || "moderator" || "editor" ...}
 * @return updated USER model with new role
 */
router.post('/:id/change-user-role',
    validate.id(),
    validate.body(User.rules.ChangeUserRole),
    auth.checkToken(),
    sec.checkSUAccess(),
    changeUserRole()
);

/**
 * @description check User name availability
 * @hasaccess: All
 */
router.get('/check-name-availability',
    validate.query(),
    checkNameAvailability()
);

/**
 * @description check User email availability
 * @hasaccess All
 */
router.get('/check-email-availability',
    validate.query(),
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
    validate.id(),
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
    validate.id(),
    auth.checkToken(),
    sec.isOwnerIdInParams(),
    getAlbumsByUserId()
);

/**
 * @description get ALBUM's by user_id
 * @return OWNER >> all mix ALBUM's by :user_id
 * @return not OWNER >> all public ALBUM's by user_id
 */
router.post('/upload-avatar',
    validate.query(User.rules.AvatarStatus),
    auth.checkToken(),
    sec.isLoggedIn(),
    upload.userAvatar(),
    setAvatarStatus()
);

/**
 * ------------------------------------------------------------
 * @BASE_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description get all Users
 * @hasaccess All
 */
router.get('/',
    getAllUsers()
);

/**
 * @description get current user profile by TUID
 */
router.get('/current',
    auth.checkToken(),
    sec.isLoggedIn(),
    getUserProfile()
);

/**
 * @return Owner >> all profile data
 * @return Anonymous or NotOwner >> only public profile data TODO
 */
router.get('/:id',
    validate.id(),
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
    validate.body(User.rules.Create),
    newUser()
);

/**
 * @description update User password
 * @hasaccess OWNER
 * @request {"oldPassword": "string", "newPassword": "string"}
 */
router.post('/change-password',
    auth.checkToken(),
    sec.isLoggedIn(),
    auth.passwordVerification(),
    auth.hashPassword(),
    validate.body(User.rules.ChangePassword),
    updatePassword()
);
/**
 * @description send email with reset-link password
 * @hasaccess OWNER
 */
router.post('/send-reset-email',
    validate.body(User.rules.SendResetEmail),
    sendResetEmail()
);

/**
 * @description update User by id
 * @hasaccess OWNER, ADMINROLES
 * @request {"name": "string", "email": "string" ...}
 */
router.patch('/:id',
    validate.id(),
    auth.checkToken(),
    sec.checkOwnerIdInParams(),
    validate.body(User.rules.Update),
    update()
);

/**
 * @description remove User from db by id
 * @hasaccess OWNER, ADMINROLES
 */
router.delete('/:id',
    validate.id(),
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

function getUserProfile() {
    return (req, res, next) => {
        User.GETbyId(req.body.helpData.userId)
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

function updatePassword () {
    return (req, res, next) => {
        User.UPDATE(req.body.helpData.userId, { password_hash: req.body.password_hash })
            .then(function (updated_user) {
                res.json({ success: true, data: updated_user });
            }).catch(next);
    };
}

function sendResetEmail () {
    return (req, res, next) => {
        User.GetByEmail(req.body.email)
            .then(user => {
                emailService.send();
                res.json({ success: true });
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

function changeUserRole() {
    return function (req, res, next) {
        delete req.body.helpData;
        User.ChangeUserRole(req.params.id, req.body)
            .then(function (data) {
                res.json({ success: true, data: data });
            }).catch(next);
    };
}

function setAvatarStatus () {
    return (req, res, next) => {
        console.log(req.body);
        User.SetAvatarStatus(req.body.helpData.userId, req.query.status)
            .then(user => {
                res.json({ success: true, data: user });
            }).catch(next);
    };
}

module.exports = router;
