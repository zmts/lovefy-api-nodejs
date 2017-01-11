'use strict';

var MainModel = require('./main');

function User() {
    MainModel.apply(this, arguments);
}

User.tableName = 'users';
MainModel.extend(User);

User.jsonSchema = {
    type: 'object',
    required: ['name', 'email', 'password_hash'],
    additionalProperties: false,
    properties: {
        id: {type: 'integer'},
        name: {type: 'string', minLength: 4, maxLength: 30},
        email: {type: 'string', format:'email', minLength: 5, maxLength: 30},
        password_hash: {type: 'string'},
        role: {type: 'string'},
        created_at: {type: 'string', format:'date-time'},
        updated_at: {type: 'string', format:'date-time'}
    }
};

User.prototype.$formatJson = function (json) {
    json = MainModel.prototype.$formatJson.call(this, json);
    delete json.password_hash;
    delete json.role;
    return json;
};

User.prototype.$beforeInsert = function () {
    // this.$validate();
};

User.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
};

// User.getByEmail = function (email) { // todo
//     return this.query().where({email: email});
// };

// User.getByName = function (name) { // todo
//     return this.query().where({name: name});
// };

module.exports = User;
