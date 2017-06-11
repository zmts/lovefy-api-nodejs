const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

module.exports.verify = (token, SECRET) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET, (error, decoded) => {
            if (decoded) {
                resolve(decoded);
            }
            reject(error);
        });
    });
};

module.exports.sign = (playload, SECRET, options) => {
    return new Promise((resolve, reject) => {
        jwt.sign(playload, SECRET, options, function (error, token) {
            if (token) {
                resolve(token);
            }
            reject(error);
        });
    });
};

