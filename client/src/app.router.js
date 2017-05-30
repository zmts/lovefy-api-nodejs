import Vue from 'vue'
import Router from 'vue-router'

import indexComponent from '@/components/index.component'
import newsComponent from '@/components/news.component'
import notFound from '@/components/not-found.component'

Vue.use(Router)

export default new Router({
    linkActiveClass: 'is-active',
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            component: indexComponent
        },
        {
            path: '/news',
            name: 'news',
            component: newsComponent
        },
        {
            path: '*',
            component: notFound
        }
    ]
})
