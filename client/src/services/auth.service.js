import axios from 'axios'

import CONFIG from '../app.config'

export default {
    makeLogin ({email, password}) {
        return axios.post(`${CONFIG.API_URL}/auth/signin`, {
            email,
            password
        })
    },

    makeLogout ({email, accessToken}) { // todo
        return axios.post(`${CONFIG.API_URL}/auth/signout`, {
            email,
            accessToken
        })
    },

    refreshTokens ({oldRefreshToken}) {
        return axios.post(`${CONFIG.API_URL}/auth/refresh-tokens`, {
            refreshToken: oldRefreshToken
        })
    }
}
