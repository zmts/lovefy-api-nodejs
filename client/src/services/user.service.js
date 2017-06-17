import axios from 'axios'

import CONFIG from '../app.config'

export default {
    getUser (user_id) {
        return axios.get(`${CONFIG.API_URL}/users/${user_id}`)
    }
}
