import axios from 'axios'
// import req from './request.init'
// console.log(req())
import CONFIG from '../app.config'

export default {
    getProfile () {
        return axios.get(`${CONFIG.API_URL}/users/current`, {
            headers: {'token': localStorage.getItem('accessToken')}
        })
    },

    getUser (user_id) {
        return axios.get(`${CONFIG.API_URL}/users/${user_id}`)
    }
}
