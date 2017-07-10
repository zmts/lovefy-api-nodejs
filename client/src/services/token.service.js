/**
 * @module_description
 * if token is valid
 * return extracted data from access token
 * else return false
 */

import jwtDecode from 'jwt-decode'

export default {
    decodeToken: () => {
        // decode access token
        let decodedAccessToken = jwtDecode(localStorage.getItem('accessToken'))

        if (decodedAccessToken.exp <= Math.round(new Date().getTime() / 1000)) {
            return false
        } else {
            return decodedAccessToken
        }
    }
}

