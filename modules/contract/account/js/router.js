angular.module('app.contract.account', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('contract/account/account-list', {
                url: 'contract/account/account-list',
                templateUrl: 'modules/contract/account/account-list.html',
                controller: 'accountListController'
            })
            .state('contract/account/account-detail', {
                url: 'contract/account/account-detail',
                templateUrl: 'modules/contract/account/account-detail.html',
                controller: 'accountDetailController',
                params: {id: -1}
            });
    });
