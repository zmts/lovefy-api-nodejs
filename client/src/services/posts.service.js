import Http from './http.init'

import CONFIG from '../app.config'

export default {
    getPosts () {
        return new Http({auth: false}).get(`${CONFIG.API_URL}/posts`)
    },

    getPostById (post_id) {
        return new Http().get(`${CONFIG.API_URL}/posts/${post_id}`)
    },

    createPost (data) {
        return new Http({auth: true}).post(`${CONFIG.API_URL}/posts/`, data)
    },

    updatePost (post_id, data) {
        return new Http({auth: true}).patch(`${CONFIG.API_URL}/posts/${post_id}`, data)
    }
}
