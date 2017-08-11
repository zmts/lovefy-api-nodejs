// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import AppLayout from './app.layout'
import router from './app.router'
import store from './store'
import authService from './services/auth.service'
import userService from './services/user.service'

import VueMaterial from 'vue-material'
import Quill from 'vue-quill'

// import Promise from 'bluebird';
// overwrite native Promise implementation with Bluebird's (for axios)
// window.Promise = Promise;

import 'vue-material/dist/vue-material.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import './scss/style.scss'

Vue.use(VueMaterial)
Vue.use(Quill)

Vue.config.productionTip = false

/* eslint-disable no-new */
export default new Vue({
    template: '<app-layout/>',
    components: {
        AppLayout
    },
    el: '#app',
    router,
    store,
    created () {
        // refresh tokens and init userData in store
        authService.refreshTokens()
            .then(res => {
                localStorage.setItem('refreshToken', res.data.refreshToken)
                localStorage.setItem('accessToken', res.data.accessToken)
                store.commit('SET_ATOKEN_EXP_DATE', res.data.expires_in)
            })
            .then(() => {
                userService.getCurrentUser()
                    .then(user => {
                        store.commit('SET_USER', user.data.data)
                    }).catch(error => console.log(error))
            })
            .catch(error => {
                if (error.response.data.badRefreshToken) {
                    console.log('badRefreshToken: true')
                }
                if (error.response.data.refreshTokenExpiredError) {
                    console.log('refreshTokenExpiredError: true, hide profile button')
                }
            })
    }
})
