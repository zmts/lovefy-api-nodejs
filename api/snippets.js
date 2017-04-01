/**
 * @param user_id
 * @return all own ALBUM's + all public ALBUM's others USER's
 */
Album.GetAllOwnAndOtherPublic = function (user_id) {
    return this.query()
        .where({ user_id: user_id })
        .orWhere({ private: false })
        .eager('tags')
        .then(function (data) {
            if (!data.length) throw { message: 'Empty response' };
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};
