'use strict';

module.exports = function() {
    var express = require('express'),
        router = express.Router(),
        root = require('../controllers');

    router.get('/', root.indexController.index());

    router.get('/test', root.testController.index());

    router.get('/login', root.loginController.index());

    router.get('/profile', root.profileController.index());

    router.get('/reg', root.regController.index());
    router.post('/reg', root.regController.new());

    router.get('/new', root.userCtrl.index());

    return router;
};
