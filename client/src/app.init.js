// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// import Promise from 'bluebird';
// overwrite native Promise implementation with Bluebird's (for axios)
// window.Promise = Promise;

// global imports
import Vue from 'vue'
import VueMaterial from 'vue-material'
import Quill from 'vue-quill'

// app imports
import AppLayout from './app.layout'
import router from './app.router'
import store from './store'
import authService from './services/auth.service'
import userService from './services/user.service'

// mixins imports
import currentUser from './mixins/currentUser'

// styles imports
import 'vue-material/dist/vue-material.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import './scss/style.scss'

Vue.use(VueMaterial)
Vue.use(Quill)

Vue.mixin(currentUser)

Vue.config.productionTip = false

/* eslint-disable no-new */
export default new Vue({
    name: 'Root',
    template: '<app-layout/>',
    components: {
        AppLayout
    },
    el: '#app',
    router,
    store,

    created () {
        if (localStorage.getItem('refreshToken')) {
            this.initAppState()
        }
    },

    methods: {

        /**
         * refresh tokens and init userData in store
         */
        initAppState () {
            authService.refreshTokens()
                .then(res => {
                    localStorage.setItem('refreshToken', res.data.refreshToken)
                    localStorage.setItem('accessToken', res.data.accessToken)
                    store.commit('SET_ATOKEN_EXP_DATE', res.data.expires_in)
                })
                .then(() => {
                    return userService.getCurrentUser()
                })
                .then(user => {
                    store.commit('SET_USER', user.data.data)
                })
                .catch(error => {
                    if (error.response.data.badRefreshToken) {
                        console.log('app.init.js >> badRefreshToken: true')
                    }
                    if (error.response.data.refreshTokenExpiredError) {
                        console.log('app.init.js >> refreshTokenExpiredError: true')
                    } else {
                        console.log(error)
                    }
                })
        }
    }
})
