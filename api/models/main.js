'use strict';

var Model = require('../config/db');

/**
 * description: Main parent model
 * extends other models by own basic methods
 */

function MainModel() {
    Model.apply(this, arguments);
}

Model.extend(MainModel);

MainModel.getAll = function () {
    return this.query()
        .then(function (data) {
            if (data.length === 0) throw {message: 'Empty response'}
            if (data) { return data }
            throw {message: 'Empty response'}
        }).catch(function (error) {
            throw error;
        });
};

MainModel.create = function (data) {
    return this.query().insert(data);
};

MainModel.getById =  function (id) {
    return this.query().findById(id)
        .then(function (data) {
            if (data) { return data }
            throw {message: 'Empty response'}
        }).catch(function (error) {
            throw error;
        });
};

MainModel.update = function (id, data) {
    return this.query().patchAndFetchById(id, data);
};

MainModel.remove = function (id) {
    return this.query().deleteById(id);
};

module.exports = MainModel;

