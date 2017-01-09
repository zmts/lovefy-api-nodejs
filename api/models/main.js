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
    return this.query();
};

MainModel.create = function (data) {
    return this.query().insert(data);
};

MainModel.getById =  function (id) {
    return this.query().where({id: id}); // todo
};

MainModel.update = function (id, data) {
    return this.query().patch(data).where({id: id}); // todo
};

MainModel.remove = function (id) {
    // return this // todo
};

module.exports = MainModel;

