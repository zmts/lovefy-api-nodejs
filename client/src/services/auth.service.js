import axios from 'axios'
import Http from '../services/http.init'

import CONFIG from '../app.config'

export default {
    makeLogin ({email, password}) {
        return axios.post(`${CONFIG.API_URL}/auth/signin`, {
            email,
            password
        })
    },

    makeLogout () {
        return new Http({auth: true}).post(`${CONFIG.API_URL}/auth/signout`, {})
    },

    refreshTokens () {
        return axios.post(`${CONFIG.API_URL}/auth/refresh-tokens`, {
            refreshToken: localStorage.getItem('refreshToken')
        })
    }
}
