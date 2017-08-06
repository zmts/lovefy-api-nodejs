import Http from './http.init'

import CONFIG from '../app.config'

export default {
    getCurrentUser () {
        return new Http({auth: true}).get(`${CONFIG.API_URL}/users/current`)
    },

    getPostsByUserId (user_id) {
        return new Http({auth: true}).get(`${CONFIG.API_URL}/users/${user_id}/posts`)
    },

    getUser (user_id) {
        return new Http({auth: true}).get(`${CONFIG.API_URL}/users/${user_id}`)
    }
}
