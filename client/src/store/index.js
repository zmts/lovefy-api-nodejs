import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userData: {
            id: '',
            role: '',
            name: '',
            email: ''
        },

        accessTokenStatus: false
    },

    actions: {},

    mutations: {
        SET_USER (state, accessTokenData) {
            state.userData = accessTokenData
        },

        SET_ACCESS_TOKEN (state, status) {
            state.accessTokenStatus = status
        }
    },

    getters: {
        userData (state) {
            return state.userData
        }
    },

    modules: {}
})
