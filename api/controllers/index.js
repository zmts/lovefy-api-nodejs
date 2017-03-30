'use strict';

const express = require('express');
const router = express.Router();

const authCtrl = require('./authCtrl');
const userCtrl = require('./userCtrl');
const postCtrl = require('./postCtrl');
const tagCtrl = require('./tagCtrl');
const albumCtrl = require('./albumCtrl');
const photoCtrl = require('./photoCtrl');

router.get('/', function (req, res) {
    res.json({ success: true, data: 'hello' });
});

router.use('/auth', authCtrl);
router.use('/users', userCtrl);
router.use('/posts', postCtrl);
router.use('/tags', tagCtrl);
router.use('/albums', albumCtrl);
router.use('/photos', photoCtrl);

//catch 'No route found' Error
router.use(function (req, res, next) {
    res.status(404).json({ success: false, error: '404, No route found' });
});

//catch 404 and forward to error handler
router.use(function (error, req, res, next) {
    res.status(error.statusCode || 422).json({
        success: false,
        handled_in: 'controllers/index',
        description: JSON.parse(error).title[0] || error
    });
});

module.exports = router;
