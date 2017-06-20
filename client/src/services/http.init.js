import axios from 'axios'

axios.defaults.headers.common['token'] = localStorage.getItem('accessToken')

export default {
    axios
}
