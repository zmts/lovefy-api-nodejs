'use strict';

var express = require('express');
var router = express.Router();

router.get('/',         index());

function index () {
    return function (req, res) {
        res.end();
    }
}

module.exports = router;
