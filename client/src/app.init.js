// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import AppLayout from './app.layout'
import router from './app.router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    template: '<app-layout/>',
    components: {
        AppLayout
    },
    el: '#app',
    router
})
