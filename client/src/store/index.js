import Vue from 'vue'
import Vuex from 'vuex'

import tokenService from '../services/token.service'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userData: {
            id: tokenService.decodeToken().sub,
            role: tokenService.decodeToken().userRole,
            name: tokenService.decodeToken().username,
            email: 'email',
            description: 'lol'
        }
    },
    actions: {},
    mutations: {},
    getters: {
        userData (state) {
            return state.userData
        }
    },
    modules: {}
})
