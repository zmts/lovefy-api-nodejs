import Vue from 'vue'
import Router from 'vue-router'

import newsComponent from '@/components/news.component'
import loginComponent from '@/components/login.component'
import postsComponent from '@/components/posts.component'
import albumsComponent from '@/components/albums.component'
import settingsComponent from '@/components/settings.component'

import notFound from '@/components/not-found.component'

import indexPage from '@/pages/index.page'
import profilePage from '@/pages/profile.page'

Vue.use(Router)

export default new Router({
    linkActiveClass: 'is-active',
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            component: indexPage
        },
        {
            path: '/login',
            name: 'login',
            component: loginComponent
        },
        {
            path: '/profile',
            component: profilePage,
            children: [
                {
                    name: 'profile',
                    path: '',
                    component: postsComponent
                },
                {
                    name: 'albums',
                    path: 'albums',
                    component: albumsComponent
                },
                {
                    path: 'posts',
                    component: postsComponent
                },
                {
                    path: 'settings',
                    component: settingsComponent
                }
            ]
        },
        {
            path: '/news',
            name: 'news',
            component: newsComponent
        },
        {
            path: '/photo',
            name: 'photo',
            component: newsComponent
        },
        {
            path: '/video',
            name: 'video',
            component: newsComponent
        },
        {
            path: '*',
            component: notFound
        }
    ]
})
