module.exports.send = () => {
    const api_key = 'key-4959b5b46fbf1f506ec5c407ba5883ad';
    const DOMAIN = 'sandboxa5815903fde5445cbc8fab423e90e1a1.mailgun.org';
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
