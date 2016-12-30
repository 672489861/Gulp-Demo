angular.module('app.frame.office')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('menu', {
                url: '/menu',
                templateUrl: 'modules/frame/office/menu.html',
                controller: 'MenuController',
                cache: false,
                params: {menuList: null}
            });
    });