(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegController', RegController);

    /** ngInject */
    function RegController() {
        var vm = this;
        vm.userName = '';

        vm.checkField = checkField;

        function checkField() {
            console.log(vm.userName)
        }

    }
})();
