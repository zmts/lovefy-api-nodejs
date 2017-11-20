/**
 * Return message for HTTP status code
 * @param {number} status - HTTP status code
 * @returns {string} Message of network operation
 */
function getErrorMessage (status) {
    let message = ''
    switch (status) {
    case 200:
        message = 'Data successfully fetched'
        break
    case 201:
        message = 'Data successfully created'
        break
    case 400:
        message = 'Validation error'
        break
    case 401:
        message = 'Need auth'
        break
    case 404:
        message = 'Not found'
        break
    default:
        message = 'Something wrong. Default error message'
        break
    }
    return message
}

/**
 * Create instant, which represent current status of response
 * @param {boolean} success status
 * @param {number} status - HTTP status code
 * @param {string|boolean} [message] - Custom message to display
 * @param {Object} [data] - custom data
 */
export class ResponseWrapper {
    constructor (response, message, data = {}) {
        this.success = response.data.success
        this.status = response.status
        this.message = message || getErrorMessage(response.status)
        this.data = data
    }
}

export class ErrorWrapper extends Error {
    constructor (error, message) {
        super()
        this.name = 'ErrorWrapper'
        this.stack = (new Error()).stack
        this.success = error.response.data.success
        this.status = error.response.status
        this.message = message || getErrorMessage(error.response.status)
    }
}
