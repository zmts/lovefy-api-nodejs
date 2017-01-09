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

MainModel.getAll = function () { // todo handle empty response
    return this.query();
};

MainModel.create = function (data) {
    return this.query().insert(data);
};

MainModel.getById =  function (id) {
    return this.query().findById(id);
};

MainModel.update = function (id, data) {
    return this.query().patchAndFetchById(id, data);
};

MainModel.remove = function (id) {
    return this.query().deleteById(id);
};

module.exports = MainModel;

