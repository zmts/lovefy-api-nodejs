module.exports.checkNameAvailability = function() {
    return function(req, res) {
        User.forge()
            .fetchAll()
            .then(function (users) {
                var data = users.serialize();

                var that = this;
                that.availabilityStatus = {success: true};

                _.forEach(data, function (user) {
                    if (user.name === req.body.name){
                        that.availabilityStatus.success = false;
                    }
                })
                res.json(that.availabilityStatus);
            }).catch(function (error) {
            console.log(error)
        });
    }
};
