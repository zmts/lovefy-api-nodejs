(function () {
    'use strict';

    angular
        .module('app')
        .config(routesConfig);

    /** @ngInject */
    function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('main', {
                url: '',
                abstract: true,
                templateUrl: 'app/main.html',
                controller: 'MainController',
                controllerAs: '$ctrlMain'
            })
            .state('main.home', {
                url: '/',
                templateUrl: 'app/pages/home/home.html',
                controller: 'HomeController',
                controllerAs: '$ctrlHome'
            })
            .state('main.news', {
                url: '/news'
                // templateUrl: 'app/pages/home/news.html',
                // controller: 'NewsController',
                // controllerAs: '$ctrlNews'
            })
            .state('main.users', {
                url: '/users',
                templateUrl: 'app/pages/users/users.html',
                controller: 'UsersController',
                controllerAs: '$ctrlUsers'
            })
            .state('main.reg', {
                url: '/reg',
                templateUrl: 'app/pages/reg/reg.html',
                controller: 'RegController',
                controllerAs: '$ctrlReg'
            })
        ;
    }
})();
