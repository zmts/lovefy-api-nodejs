import axios from 'axios'

export default () => {
    axios.defaults.headers.common['token'] = localStorage.getItem('accessToken')
    return axios
}
