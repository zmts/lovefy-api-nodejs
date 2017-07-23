import Vue from 'vue'
import Router from 'vue-router'

import newsComponent from '@/components/news.component'
import loginComponent from '@/components/login.component'
import postsComponent from '@/components/posts.component'
import postsItemComponent from '@/components/posts-item.component'
import newPostComponent from '@/components/new-post.component'
import albumsComponent from '@/components/albums.component'
import settingsComponent from '@/components/settings.component'

import notFound from '@/components/not-found.component'

import indexPage from '@/pages/index.page'
import profilePage from '@/pages/profile.page'

import $store from './store'

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
                    path: '',
                    name: 'profile',
                    component: postsComponent
                },
                {
                    path: 'albums',
                    name: 'albums',
                    component: albumsComponent,
                    beforeEnter: (to, from, next) => {
                        if ($store.state.userData.role === 'editor') {
                            next()
                        } else {
                            next('/')
                        }
                    }
                },
                {
                    path: 'posts',
                    name: 'posts',
                    component: postsComponent,
                    beforeEnter: (to, from, next) => {
                        if ($store.state.userData.role === 'editor') {
                            next()
                        } else {
                            next('/')
                        }
                    }
                },
                {
                    path: 'posts/new',
                    component: newPostComponent,
                    beforeEnter: (to, from, next) => {
                        if ($store.state.userData.role === 'editor') {
                            next()
                        } else {
                            next('/')
                        }
                    }
                },
                {
                    path: 'posts/:id',
                    component: postsItemComponent
                },
                {
                    path: 'settings',
                    name: 'settings',
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
