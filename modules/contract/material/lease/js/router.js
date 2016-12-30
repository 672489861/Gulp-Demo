angular.module('app.contract.material.lease', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('contract/material/lease/material-lease-list', {
                url: 'contract/material/lease/material-lease-list',
                templateUrl: 'modules/contract/material/lease/material-lease-list.html',
                controller: 'MaterialLeaseListController'
            })
            .state('contract/material/lease/material-lease-detail', {
                url: 'contract/material/lease/material-lease-detail',
                templateUrl: 'modules/contract/material/lease/material-lease-detail.html',
                controller: 'MaterialLeaseDetailController',
                params: {id: null}
            })
            .state('contract/material/lease/material-lease-material-info', {
                url: 'contract/material/lease/material-lease-material-info',
                templateUrl: 'modules/contract/material/lease/material-info.html',
                controller: 'MaterialLeaseMaterialController'
            })
            .state('contract/material/lease/material-lease-charges-info', {
                url: 'contract/material/lease/material-lease-charges-info',
                templateUrl: 'modules/contract/material/lease/charges-info.html',
                controller: 'MaterialLeaseChargesController'
            })
            .state('contract/material/lease/material-lease-invoice-info', {
                url: 'contract/material/lease/material-lease-invoice-info',
                templateUrl: 'modules/contract/material/lease/invoice-info.html',
                controller: 'MaterialLeaseInvoiceController'
            })
    });
