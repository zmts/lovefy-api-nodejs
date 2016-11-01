(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersController', UsersController);

    /** ngInject */
    function UsersController(UsersService, $log) {
        var vm = this;
            vm.usersList = [];

        UsersService.fetchUsersList().then(function (resp) {
            vm.usersList = resp;
            $log.log(vm.usersList);
        }, function (err) {
            $log.log(err);
        });

    }
})();
