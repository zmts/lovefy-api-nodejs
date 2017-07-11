import http from '../services/http.init'

import CONFIG from '../app.config'

export default {
    getPosts () {
        return http.request({
            handler: () => {
                return http.axios.get(`${CONFIG.API_URL}/posts`)
            }
        })
    }
}
