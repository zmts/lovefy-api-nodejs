'use strict';

var MainModel = require('./main');

function User() {
    MainModel.apply(this, arguments);
}

User.tableName = 'users';
MainModel.extend(User);

// User.getByEmail = function (email) { // todo
//     return this.query().where({email: email});
// };

// User.getByName = function (name) { // todo
//     return this.query().where({name: name});
// };

module.exports = User;
