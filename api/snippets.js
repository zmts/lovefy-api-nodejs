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

// Get Albums By Tag Id with pagination
// by @koskimas
this.query().findById(tag_id).then(tag => {
    return tag.$relatedQuery('posts')
        .orderBy('id', 'desc')
        .page(pageNumber, process.env.PAGE_SIZE)
        .then(posts => tag.posts = posts);
})
