angular.module('app.contract.equipment.purchase', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('contract/equipment/purchase/equipment-purchase-list', {
                url: 'contract/equipment/purchase/equipment-purchase-list',
                templateUrl: 'modules/contract/equipment/purchase/equipment-purchase-list.html',
                controller: 'EquipmentPurchaseListController'
            })
            .state('contract/equipment/purchase/equipment-purchase-detail', {
                url: 'contract/equipment/purchase/equipment-purchase-detail',
                templateUrl: 'modules/contract/equipment/purchase/equipment-purchase-detail.html',
                controller: 'EquipmentPurchaseDetailController',
                params: {id: null}
            })
            .state('contract/equipment/purchase/equipment-purchase-equipment-info', {
                url: 'contract/equipment/purchase/equipment-purchase-equipment-info',
                templateUrl: 'modules/contract/equipment/purchase/equipment-info.html',
                controller: 'EquipmentPurchaseEquipmentController'
            })
            .state('contract/equipment/purchase/equipment-purchase-charges-info', {
                url: 'contract/equipment/purchase/equipment-purchase-charges-info',
                templateUrl: 'modules/contract/equipment/purchase/charges-info.html',
                controller: 'EquipmentPurchaseChargesController'
            })
            .state('contract/equipment/purchase/equipment-purchase-invoice-info', {
                url: 'contract/equipment/purchase/equipment-purchase-invoice-info',
                templateUrl: 'modules/contract/equipment/purchase/invoice-info.html',
                controller: 'EquipmentPurchaseInvoiceController'
            })
    });
