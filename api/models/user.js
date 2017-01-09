'use strict';

var MainModel = require('./main');

function User() {
    MainModel.apply(this, arguments);
}

User.tableName = 'users';
MainModel.extend(User);


module.exports = User;
