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


// query all entries related to some id
// User.where({ id: 2 })
//     .fetch({
//         withRelated: ['posts']
//     })
//     .then(function(model) {
//         res.send(model.serialize());
//         // res.send(model.get('name'));
//     })
//     .catch(function(error) {
//         console.log(error);
//         res.send('An error occured');
//     });

// query specific entry
// User.forge()
//     .where('id', 2)
//     .fetch()
//     .then(function(model) {
//         res.send(model.serialize());
//     })
//     .catch(function(error) {
//         console.log(error);
//         res.send('An error occured');
//     });

// query all entries
// User.forge()
//     .fetchAll()
//     .then(function(model) {
//         res.send(model.serialize());
//     })
//     .catch(function(error) {
//         console.log(error);
//         res.send('An error occured');
//     });

// create new entry
// User.forge({'name': 'qwerty'})
//     .save()
//     .then(function(model) {
//         res.send(model.serialize());
//     })
//     .catch(function(error) {
//         console.log(error);
//         res.send('An error occured');
//     });

// Promise using
// update: Promise.method(function (id, data) {
//     return this.forge({id: id}).save(data);
// }),
