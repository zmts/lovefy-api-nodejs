// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import AppLayout from './app.layout'
import router from './app.router'
import store from './store'

// import Promise from 'bluebird';
// overwrite native Promise implementation with Bluebird's (for axios)
// window.Promise = Promise;

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

import './scss/style.scss'

Vue.use(VueMaterial)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    template: '<app-layout/>',
    components: {
        AppLayout
    },
    el: '#app',
    router,
    store
})
