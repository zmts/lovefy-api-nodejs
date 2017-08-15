import axios from 'axios'

import CONFIG from '../app.config'

export default {
    makeLogin ({email, password}) {
        return axios.post(`${CONFIG.API_URL}/auth/signin`, {
            email,
            password
        })
    },

    makeLogout ({email, accessToken}) { // todo test
        return axios.post(`${CONFIG.API_URL}/auth/signout`, {})
    },

    refreshTokens () {
        return axios.post(`${CONFIG.API_URL}/auth/refresh-tokens`, {
            refreshToken: localStorage.getItem('refreshToken')
        })
    }
}
