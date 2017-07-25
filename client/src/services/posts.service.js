import http from './http.init'

import CONFIG from '../app.config'

export default {
    getPosts () {
        return http.request({
            handler: () => {
                return http.axios.get(`${CONFIG.API_URL}/posts`)
            }
        })
    },

    getPostById (post_id) {
        return http.request({
            handler: () => {
                return http.axios.get(`${CONFIG.API_URL}/posts/${post_id}`)
            }
        })
    },

    createPost (data) {
        return http.request({
            handler: () => {
                return http.axios.post(`${CONFIG.API_URL}/posts/`, data)
            }
        })
    },

    updatePost (post_id, data) {
        return http.request({
            handler: () => {
                return http.axios.patch(`${CONFIG.API_URL}/posts/${post_id}`, data)
            }
        })
    }
}
