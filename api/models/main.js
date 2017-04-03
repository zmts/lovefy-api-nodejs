'use strict';

const Model = require('../config/db');

/**
 * @description Main parent model
 * extends other models by own basic methods
 */

function MainModel() {
    Model.apply(this, arguments);
}

Model.extend(MainModel);

MainModel.CREATE = function (data) {
    return this.query().insert(data);
};

MainModel.GETall = function () {
    return this.query()
        .then(function (data) {
            if (!data.length) throw { message: 'Empty response', status: 404 };
            return data;
        })
        .catch(function (error) {
            throw error;
        });
};

MainModel.GETbyId = function (id) {
    return this.query().findById(id)
        .then(function (data) {
            if (!data) throw { message: 'Empty response', status: 404 };
            return data;
        })
        .catch(function (error) {
            throw error;
        });
};

MainModel.UPDATE = function (id, data) {
    return this.query().patchAndFetchById(id, data);
};

MainModel.REMOVE = function (id) {
    return this.query().deleteById(id);
};

module.exports = MainModel;

