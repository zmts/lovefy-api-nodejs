module.exports.send = () => {
    const api_key = process.env.MAILGUN_API_KEY;
    const DOMAIN = process.env.MAILGUN_DOMAIN;
    const mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });

    const data = {
        from: 'Whiteside <hello@whiteside.in.ua>',
        to: 'zloy.root@gmail.com',
        subject: 'Hello',
        text: 'Testing some Mailgun awesomness!'
    };

    mailgun.messages().send(data, function (error, response) {
        if (error) { console.log(error) }
        else { console.log(response) }
    });
};
