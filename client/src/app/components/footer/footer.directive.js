(function () {
    'use strict';

    angular
        .module('app')
        .directive('footerPortal', footerPortal);

    /** @ngInject */
    function footerPortal() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/footer/footer.html',
            controller: footerController,
            controllerAs: 'vm',
            bindToController: true
        };

        function footerController() {
            // var vm = this;

        }
    }
})();
