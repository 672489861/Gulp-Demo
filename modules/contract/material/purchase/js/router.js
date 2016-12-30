angular.module('app.contract.material.purchase', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('contract/material/purchase/material-purchase-list', {
                url: 'contract/material/purchase/material-purchase-list',
                templateUrl: 'modules/contract/material/purchase/material-purchase-list.html',
                controller: 'MaterialPurchaseListController'
            })
            .state('contract/material/purchase/material-purchase-detail', {
                url: 'contract/material/purchase/material-purchase-detail',
                templateUrl: 'modules/contract/material/purchase/material-purchase-detail.html',
                controller: 'MaterialPurchaseDetailController',
                params: {id: null}
            })
            .state('contract/material/purchase/material-purchase-material-info', {
                url: 'contract/material/purchase/material-purchase-material-info',
                templateUrl: 'modules/contract/material/purchase/material-info.html',
                controller: 'MaterialPurchaseMaterialController'
            })
            .state('contract/material/purchase/material-purchase-charges-info', {
                url: 'contract/material/purchase/material-purchase-charges-info',
                templateUrl: 'modules/contract/material/purchase/charges-info.html',
                controller: 'MaterialPurchaseChargesController'
            })
            .state('contract/material/purchase/material-purchase-invoice-info', {
                url: 'contract/material/purchase/material-purchase-invoice-info',
                templateUrl: 'modules/contract/material/purchase/invoice-info.html',
                controller: 'MaterialPurchaseInvoiceController'
            })
    });
