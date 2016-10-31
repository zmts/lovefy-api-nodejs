'use strict';

module.exports = function() {
    var express = require('express'),
        router = express.Router(),
        root = require('../controllers');

    router.get('/', function (req, res) {
        res.send('Hello public routes')
    });

    router.post('/checkNameAvailability', root.checkNameAvailabilityCtrl.index());

    return router;
};
