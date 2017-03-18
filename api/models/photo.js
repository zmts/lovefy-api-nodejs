'use strict';

const MainModel = require('./main');
// const PHOTO_DIR = require('../config/').files.photo.localpath;
const PHOTO_URL = require('../config/').files.photo.globalpath;


function Photo() {
    MainModel.apply(this, arguments);
}

Photo.tableName = 'photos';
MainModel.extend(Photo);

Photo.jsonSchema = {
    type: 'object',
    required: ['album_id', 'user_id'],
    additionalProperties: false,
    properties: {
        id: { type: 'integer' },
        album_id: { type: 'integer' },
        user_id: { type: 'integer' },
        views: { type: 'integer' },
        best: { type: 'boolean' },
        filename: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
    }
};

/**
 * ------------------------------
 * @VIRTUAL_ATTRIBUTES
 * ------------------------------
 */
Photo.virtualAttributes = [
    '_path'
];

Photo.prototype._path = function () {
    return `${PHOTO_URL}/uid-${this.user_id}/${this.album_id}/src/${this.filename}`;
};


/**
 * ------------------------------
 * @HOOKS
 * ------------------------------
 */

Photo.prototype.$beforeInsert = function (/*json*/) {
    // this.$validate();
};

Photo.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
    // this.$validate();
};

/**
 * ------------------------------
 * @METHODS
 * ------------------------------
 */

/**
 * @description get Photo by Id and Update views counter
 * @param id
 * @return {Promise.<T>}
 */
Photo.getByIdAndIncrementViews = function (id) {
    let that = this;

    return this.getById(id)
        .then(function (model) {
            return that.update(model.id, { views: model.views + 1 });
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

module.exports = Photo;
