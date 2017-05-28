'use strict';

const express = require('express');
const router = express.Router();

const CommentToPost = require('../models/commentToPost');
// const CommentToAlbum = require('../models/commentToAlbum');
// const CommentToPhoto = require('../models/commentToPhoto');

const auth = require('../middleware/auth');
const sec = require('../middleware/security');
const validate = require('../middleware/validateReq');

/**
 * ------------------------------------------------------------
 * @BASE_URL: comments/
 * ------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------
 * @BASE_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description add comment to Post
 * @hasaccess All
 */
router.post('/comment-post/:post_id',
    validate.id(),
    auth.checkToken(),
    // addCommentToPost() // TODO
);

/**
 * @description update comment Post
 * @hasaccess ADMINROLES, Owner
 */
router.patch('/comment-post/:post_id/:comment_id',
    validate.id(),
    auth.checkToken(),
    // updateCommentPost() // TODO
);

/**
 * @description delete comment Post
 * @hasaccess ADMINROLES, Owner
 */
router.delete('/comment-post/:post_id/:comment_id',
    validate.id(),
    auth.checkToken(),
    // deleteCommentPost() // TODO
);

/**
 * @description add comment to Album
 * @hasaccess All
 */
router.post('/comment-album/:album_id',
    validate.id(),
    auth.checkToken(),
    // addCommentToAlbum() // TODO
);

// ...


/**
 * ------------------------------------------------------------
 * @CONTROLLERS
 * ------------------------------------------------------------
 */

