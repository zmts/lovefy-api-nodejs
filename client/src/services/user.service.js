import http from './http.init'

import CONFIG from '../app.config'

export default {
    getCurrentUser () {
        return http.request({
            handler: () => {
                return http.axios.get(`${CONFIG.API_URL}/users/current`)
            }
        })
    }
    //
    // getUser (user_id) {
    //     return http.axios.get(`${CONFIG.API_URL}/users/${user_id}`)
    // }
}
