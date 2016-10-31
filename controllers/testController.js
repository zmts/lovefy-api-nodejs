'use strict';

var User = require('../models/user');
// var Post = require('../models/post');

module.exports.index = function() {
    return function(req, res, next) {
        User.where({ id: 2 })
            .fetch({
                withRelated: ['posts']
            })
            .then(function(model) {
                res.send(model.serialize());
                // res.send(model.get('name'));
            })
            .catch(function(error) {
                console.log(error);
                res.send('An error occured');
            });
    }
}

// query all entries related to some id
// User.where({ id: 2 })
//     .fetch({
//         withRelated: ['posts']
//     })
//     .then(function(model) {
//         res.send(model.serialize());
//         // res.send(model.get('name'));
//     })
//     .catch(function(error) {
//         console.log(error);
//         res.send('An error occured');
//     });

// query specific entry
// User.forge()
//     .where('id', 2)
//     .fetch()
//     .then(function(model) {
//         res.send(model.serialize());
//     })
//     .catch(function(error) {
//         console.log(error);
//         res.send('An error occured');
//     });

// query all entries
// User.forge()
//     .fetchAll()
//     .then(function(model) {
//         res.send(model.serialize());
//     })
//     .catch(function(error) {
//         console.log(error);
//         res.send('An error occured');
//     });

// create new entry
// User.forge({'name': 'qwerty'})
//     .save()
//     .then(function(model) {
//         res.send(model.serialize());
//     })
//     .catch(function(error) {
//         console.log(error);
//         res.send('An error occured');
//     });
