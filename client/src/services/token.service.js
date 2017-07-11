/**
 * @module_description
 * if token is valid
 * return extracted data from access token
 * else return false
 */

import jwtDecode from 'jwt-decode'

export default {
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
    }
}

