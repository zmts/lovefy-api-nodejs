import axios from 'axios'

import CONFIG from '../app.config'

export default {
    getNews () {
        return axios.get(`${CONFIG.API_URL}/posts`)
    }
}
