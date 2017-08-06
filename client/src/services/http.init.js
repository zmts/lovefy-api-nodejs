/**
 * request constructor function
 * if auth is required return patched axios instance
 * else return clear axios instance
 */

import axios from 'axios'

import App from '../app.init'
// import authService from '../services/auth.service'
// import tokenService from '../services/token.service'
// import $store from '../store'

export default (status) => {
    this.isAuth = status && status.auth ? status.auth : false
    this.instance = axios.create()

    if (this.isAuth) {
        this.instance.interceptors.request.use(request => {
            request.headers['token'] = localStorage.getItem('accessToken')
            // if access token expired
            // go to API and get new access token
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
