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

// import store from '../store'
// import router from '../router'
// import Http from '../services/http.init'
// import * as CONFIG from '../app.config'
//
// /**
//  ******************************
//  ******************************
//  * API Calls
//  ******************************
//  ******************************
//  */
//
// export function makeLogin ({email, password}) {
//     return axios.post(`${CONFIG.API_URL}/auth/signin`, {
//         email,
//         password
//     })
// }
//
// export function refreshTokens () {
//     return axios.post(`${CONFIG.API_URL}/auth/refresh-tokens`, {
//         refreshToken: localStorage.getItem('refreshToken')
//     })
// }
//
// export function makeLogout () {
//     return new Http({auth: true}).post(`${CONFIG.API_URL}/auth/signout`, {})
//         .then(() => {
//             router.push({name: 'index'})
//             resetAuthData()
//         })
// }
//
// /**
//  ******************************
//  ******************************
//  * Auth methods
//  ******************************
//  ******************************
//  */
//
// export function resetAuthData () {
//     // reset userData in store
//     store.commit('SET_USER', {})
//     store.commit('SET_ATOKEN_EXP_DATE', null)
//     // reset tokens in localStorage
//     localStorage.setItem('refreshToken', '')
//     localStorage.setItem('accessToken', '')
// }

