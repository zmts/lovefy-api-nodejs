const config = require('./index');

var knex = require('knex')({
    client: 'pg',
    connection: {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.db_name,
        charset: config.db.charset
    },
    pool: {
        min: 1,
        max: 10
    },
    debug: true
});

module.exports.bookshelf = require('bookshelf')(knex).plugin('registry');

