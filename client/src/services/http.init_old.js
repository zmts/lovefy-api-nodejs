import axios from 'axios'

import App from '../app.init'
import authService from '../services/auth.service'
import tokenService from '../services/token.service'
import $store from '../store'

// set defaults to axios
// axios.defaults.headers.common['token'] = localStorage.getItem('accessToken')

// todo add some logic that add a token status to store

export default {
    axios,

    request: (options) => {
        // check options
        if (!options && typeof options === !'object') {
            throw Error('request() method required "options" param as "Object"')
        }

        tokenService.decodeToken()
        // if access token has expired >> get new token and send request
        if (!$store.state.accessTokenStatus) {
            tokenService.decodeToken()

            return authService.refreshTokens({
                email: $store.state.userData.email,
                oldRefreshToken: localStorage.getItem('refreshToken')
            })
            .then(res => {
                // update tokens in localStorage
                localStorage.setItem('refreshToken', res.data.refreshToken)
                localStorage.setItem('accessToken', res.data.accessToken)
                // update access token in axios defaults
                axios.defaults.headers.common['token'] = localStorage.getItem('accessToken')
                // return res
            })
            .then(() => {
                tokenService.setUserData()
                $store.commit('SET_ACCESS_TOKEN', true)
                console.log('$store.state.accessTokenStatus', $store.state.accessTokenStatus)
            })
            .then(() => {
                // send request
                return options.handler()
            }).catch(error => {
                if (error.response.data.badRefreshToken) {
                    console.log('badRefreshToken: true')
                    // location.pathname = 'login'
                    App.$router.push('login')
                }
                if (error.response.data.refreshTokenExpiredError) {
                    console.log('refreshTokenExpiredError: true, go to login')
                    // location.pathname = 'login'
                    App.$router.push('login')
                    // hide profile button and show login button TODO
                }
            })
        } else { // send request
            return options.handler()
        }
    }
}
