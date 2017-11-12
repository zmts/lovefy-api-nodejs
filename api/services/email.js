/**
 * https://documentation.mailgun.com/en/latest/api-sending.html#examples
 */

const Promise = require('bluebird')

const API_KEY = process.env.MAILGUN_API_KEY
const DOMAIN = process.env.MAILGUN_DOMAIN
const EMAIL_FROM = process.env.EMAIL_FROM
const EMAIL_TO_TEST = process.env.EMAIL_TO_TEST
const mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN })

/*
 * Example:
 * from: 'Title <hello@super.com>'
 * to: 'best.user@mail.com'
 * subject: 'Hello',
 * text: 'Testing some Mailgun awesomness!'
 */
module.exports.send = (letter) => {
    const data = {
        from: letter.from || EMAIL_FROM,
        to: letter.to || EMAIL_TO_TEST,
        subject: letter.subject || 'Hello',
        text: letter.text || 'Testing some Mailgun awesomness!'
    }

    return new Promise((resolve, reject) => {
        mailgun.messages().send(data, (error, response) => {
            if (error) return reject(error)
            return resolve(response)
        })
    })
}
