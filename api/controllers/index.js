'use strict';

const express = require('express');
const router = express.Router();

const authCtrl = require('./authCtrl');
const userCtrl = require('./userCtrl');
const postCtrl = require('./postCtrl');
const tagCtrl = require('./tagCtrl');
const albumCtrl = require('./albumCtrl');
const photoCtrl = require('./photoCtrl');
const commentCtrl = require('./commentCtrl');

// handle root route
router.get('/', function (req, res) {
    res.json({ success: true, data: 'hello' });
});

// set metadata object
router.use((req, res, next) => {
    req.body.meta = {
        user: {
            id: false
        }
    };
    next();
});

router.use('/auth', authCtrl);
router.use('/users', userCtrl);
router.use('/posts', postCtrl);
router.use('/tags', tagCtrl);
router.use('/albums', albumCtrl);
router.use('/photos', photoCtrl);
router.use('/comments', commentCtrl);

module.exports = router;
