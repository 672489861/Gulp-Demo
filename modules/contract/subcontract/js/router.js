angular.module('app.contract.subcontract', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('contract/subcontract/subcontract-list', {
                url: 'contract/subcontract/subcontract-list',
                templateUrl: 'modules/contract/subcontract/subcontract-list.html',
                controller: 'SubcontractListController'
            })
            .state('contract/subcontract/subcontract-detail', {
                url: 'contract/subcontract/subcontract-detail',
                templateUrl: 'modules/contract/subcontract/subcontract-detail.html',
                controller: 'SubcontractDetailController',
                params: {id: null}
            })
            .state('contract/subcontract/subcontract-info', {
                url: 'contract/subcontract/subcontract-info',
                templateUrl: 'modules/contract/subcontract/subcontract-info.html',
                controller: 'SubcontractSubcontractController'
            })
            .state('contract/subcontract/charges-info', {
                url: 'contract/subcontract/charges-info',
                templateUrl: 'modules/contract/subcontract/charges-info.html',
                controller: 'SubcontractChargesController'
            })
            .state('contract/subcontract/invoice-info', {
                url: 'contract/subcontract/invoice-info',
                templateUrl: 'modules/contract/subcontract/invoice-info.html',
                controller: 'SubcontractInvoiceController'
            })
    });

