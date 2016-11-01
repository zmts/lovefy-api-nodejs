'use strict';

module.exports = function() {
    var express = require('express'),
        router = express.Router(),
        root = require('../controllers');

    router.get('/', root.indexCtrl.index());

    router.get('/test', root.testCtrl.index());

    router.get('/login', root.loginCtrl.index());

    router.get('/reg', root.regCtrl.index());
    router.post('/reg', root.regCtrl.new());

    router.get('/new', root.userCtrl.index());

    return router;
};
