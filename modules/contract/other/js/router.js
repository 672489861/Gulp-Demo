angular.module('app.contract.other', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('contract/other/other-list', {
                url: 'contract/other/other-list',
                templateUrl: 'modules/contract/other/other-list.html',
                controller: 'OtherListController'
            })
            .state('contract/other/other-detail', {
                url: 'contract/other/other-detail',
                templateUrl: 'modules/contract/other/other-detail.html',
                controller: 'OtherDetailController',
                params: {id: null}
            })
            .state('contract/other/invoice-info', {
                url: 'contract/other/invoice-info',
                templateUrl: 'modules/contract/other/invoice-info.html',
                controller: 'OtherInvoiceController'
            })
    });

