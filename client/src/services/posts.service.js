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
    }
}
