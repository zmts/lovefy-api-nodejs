import Promise from 'bluebird'
import Http from './http.init'
import { ResponseWrapper, ErrorWrapper } from './util'

import * as CONFIG from '../app.config'

export default {
    getPosts () {
        return new Promise((resolve, reject) => {
            new Http().get(`${CONFIG.API_URL}/posts`)
                .then(response => {
                    let data = {
                        content: response.data.data.results,
                        total: response.data.data.total
                    }
                    resolve(new ResponseWrapper(response, data))
                })
                .catch(error => {
                    let message = error.response.data ? error.response.data.error : error.response.statusText
                    reject(new ErrorWrapper(error, message))
                })
        })
    },

    getPostById (post_id) {
        return new Http({auth: true}).get(`${CONFIG.API_URL}/posts/${post_id}`)
    },

    createPost (data) {
        return new Http({auth: true}).post(`${CONFIG.API_URL}/posts/`, data)
    },

    updatePost (post_id, data) {
        return new Http({auth: true}).patch(`${CONFIG.API_URL}/posts/${post_id}`, data)
    }
}
