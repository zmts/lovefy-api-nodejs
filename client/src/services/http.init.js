/**
 * request constructor function
 * if auth is required return patched axios instance
 * else return clear axios instance
 */

import axios from 'axios'

import App from '../app.init'
// import authService from '../services/auth.service'
import $store from '../store'

export default (status) => {
    this.isAuth = status && status.auth ? status.auth : false
    this.instance = axios.create()

    if (this.isAuth) {
        this.instance.interceptors.request.use(request => {
            request.headers['token'] = localStorage.getItem('accessToken')
            // if access token expired
            // go to API and get new access token
            if ($store.state.accessTokenExpDate <= (Math.floor(new Date().getTime() / 1000))) {
                // authService.refreshTokens()
                //     .then(res => {
                //         localStorage.setItem('refreshToken', res.data.refreshToken)
                //         localStorage.setItem('accessToken', res.data.accessToken)
                //         request.headers['token'] = res.data.accessToken
                //         $store.commit('SET_ATOKEN_EXP_DATE', res.data.expires_in)
                //     })
                //     .catch(error => {
                //         if (error.response.data.badRefreshToken) {
                //             console.log(error)
                //             console.log('badRefreshToken: true')
                //         }
                //         if (error.response.data.refreshTokenExpiredError) {
                //             console.log('refreshTokenExpiredError: true, hide profile button')
                //         }
                //     })
                // console.log('new req')
                return request
            }

            return request
        }, error => {
            return Promise.reject(error)
        })

        this.instance.interceptors.response.use(response => {
            return response
        }, error => {
            if (error.response.data.badRefreshToken) {
                console.log('badRefreshToken: true')
                App.$router.push('login')
            }

            if (error.response.data.refreshTokenExpiredError) {
                console.log('refreshTokenExpiredError: true')
                App.$router.push('login')
            }
            return Promise.reject(error)
        })

        return this.instance
    }

    return this.instance
}
