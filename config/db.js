// db setup
var knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'zandr',
        password: '',
        database: 'portal_test',
        charset: 'utf8'
    },
    pool: {
        min: 1,
        max: 10
    },
    debug: true
});

module.exports.bookshelf = require('bookshelf')(knex).plugin('registry');

