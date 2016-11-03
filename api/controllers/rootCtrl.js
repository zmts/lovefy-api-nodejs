'use strict';

var express = require('express'),
    router = express.Router();

router.get('/',         index());
// router.get('/login',    login());
// router.get('/test',     test());

function index() {
    return function(req, res) {
        res.end();
    }
}


module.exports = router;
