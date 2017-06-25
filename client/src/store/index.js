import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userData: {
            id: '1',
            role: 'user',
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
