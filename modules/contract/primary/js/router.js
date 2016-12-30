angular.module('app.contract.primary', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('contract/primary/primary-list', {
                url: 'contract/primary/primary-list',
                templateUrl: 'modules/contract/primary/primary-list.html',
                controller: 'PrimaryListController'
            })
            .state('contract/primary/primary-detail', {
                url: 'contract/primary/primary-detail',
                templateUrl: 'modules/contract/primary/primary-detail.html',
                controller: 'PrimaryDetailController',
                params: {id: null}
            });
    });