module.exports.checkNewUserName = function() {
    return function(req, res, next) {
        if (req.body.name === 'aaa'){
             next();
        } else {
            res.send('Neaaa');
        };
    };
};



