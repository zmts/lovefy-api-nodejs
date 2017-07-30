import jwtDecode from 'jwt-decode'
import $store from '../store'

export default {

    /**
     * if  access token is valid >> decode
     * else return false
     */
    decodeToken: () => {
        let decodedAccessToken = ''
        try {
            // decode access token
            decodedAccessToken = jwtDecode(localStorage.getItem('accessToken'))
        } catch (error) {
            console.log(error)
        }

        if (decodedAccessToken && decodedAccessToken.exp <= Math.round(new Date().getTime() / 1000)) {
            return false
        } else {
            return decodedAccessToken
        }
    },

    /**
     * commit decoded user data to store
     */
    setUserData () {
        $store.commit('SET_USER', {
            id: this.decodeToken().sub,
            role: this.decodeToken().userRole,
            name: this.decodeToken().username,
            email: this.decodeToken().email
        })
    }
}

