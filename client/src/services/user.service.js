import http from './http.init'

import CONFIG from '../app.config'

export default {
    getProfile () {
        return http.axios.get(`${CONFIG.API_URL}/users/current`)
            // .then(res => res)
            // .catch(error => {
            //     if (error.response.data.accessTokenExpiredError) {
            //         console.log('accessTokenExpiredError')
            //     }
            //     console.log('error')
            // })
    },

    getUser (user_id) {
        return http.axios.get(`${CONFIG.API_URL}/users/${user_id}`)
    }
}
