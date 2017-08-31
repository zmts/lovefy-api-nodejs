/**
 * request constructor function
 * if auth is required return patched axios instance
 * else return clear axios instance
 */

import axios from 'axios'

import App from '../app.init'
import authService from '../services/auth.service'
import $store from '../store'

export default function Request (status) {
    this.isAuth = status && status.auth ? status.auth : false
    this.instance = axios.create()

    if (this.isAuth) {
        this.instance.interceptors.request.use(request => {
            request.headers['token'] = localStorage.getItem('accessToken')
            // if access token expired >> go to API and get new access token
            if ($store.state.accessTokenExpDate <= (Math.floor(new Date().getTime() / 1000))) {
                return authService.refreshTokens()
                    .then(res => {
                        localStorage.setItem('refreshToken', res.data.refreshToken)
                        localStorage.setItem('accessToken', res.data.accessToken)
                        request.headers['token'] = res.data.accessToken
                        $store.commit('SET_ATOKEN_EXP_DATE', res.data.expires_in)

                        return request
                    })
                    .catch(error => {
                        if (error.response.data.badRefreshToken) {
                            console.log('http.init.js >> badRefreshToken: true')
                            $store.commit('SET_USER', {})
                        }
                        if (error.response.data.refreshTokenExpiredError) {
                            console.log('http.init.js >> refreshTokenExpiredError')
                            $store.commit('SET_USER', {})
                            App.$router.push('/')
                        }
                    })
            } else {
                return request
            }
        }, error => {
            return Promise.reject(error)
        })

        return this.instance
    }

    return this.instance
}
