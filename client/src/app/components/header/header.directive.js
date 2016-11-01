(function () {
    'use strict';

    angular
        .module('app')
        .directive('headerPortal', headerPortal);

    /** @ngInject */
    function headerPortal() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/header/header.html',
            controller: HeaderController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {}
        };

        function HeaderController($state, $transitions) {
            var vm = this;

            checkCurrentState(); // check url on page load
            $transitions.onSuccess({}, checkCurrentState); // check url on each loading

            function checkCurrentState() {
                vm.activeState = $state.current.name;
            }
        }
    }
})();
