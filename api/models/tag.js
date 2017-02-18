'use strict';

var MainModel = require('./main');

function Tag() {
    MainModel.apply(this, arguments);
}

Tag.tableName = 'tags';
MainModel.extend(Tag);

Tag.jsonSchema = {
    type: 'object',
    required: ['name'],
    additionalProperties: false,
    properties: {
        id: {type: 'integer'},
        name: {type: 'string', minLength: 3, maxLength: 30},
        created_at: {type: 'string', format: 'date-time'},
        updated_at: {type: 'string', format: 'date-time'}
    }
};

// Tag.relationMappings = {
//     posts:{
//         relation: MainModel.HasManyRelation,
//         modelClass: __dirname + '/post',
//         join: {
//             from: 'users.id',
//             to: 'posts.user_id'
//         }
//     }
// };


Tag.prototype.$beforeInsert = function () {
    // this.$validate();
};

Tag.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
};


Tag.getByName = function (name) {
    return this.query().where({name: name})
        .then(function (data) {
            if (!data.length) throw {message: 'Empty response'};
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

module.exports = Tag;
