(function () {
    'use strict';

    angular
        .module('app')
        .factory('UsersService', UsersService);

    /** @ngInject */
    function UsersService($resource, $q, CONFIG) {
        return {
            fetchUsersList: fetchUsersList
        }

        function fetchUsersList() {
            var resource = $resource(CONFIG.API_URL + 'public/user/all');
            var deferred = $q.defer();

            resource.query(function (resp) {
                deferred.resolve(resp);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
    }
})();
