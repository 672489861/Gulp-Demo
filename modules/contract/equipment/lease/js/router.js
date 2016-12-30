angular.module('app.contract.equipment.lease', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('contract/equipment/lease/equipment-lease-list', {
                url: 'contract/equipment/lease/equipment-lease-list',
                templateUrl: 'modules/contract/equipment/lease/equipment-lease-list.html',
                controller: 'EquipmentLeaseListController'
            })
            .state('contract/equipment/lease/equipment-lease-detail', {
                url: 'contract/equipment/lease/equipment-lease-detail',
                templateUrl: 'modules/contract/equipment/lease/equipment-lease-detail.html',
                controller: 'EquipmentLeaseDetailController',
                params: {id: null}
            })
            .state('contract/equipment/lease/equipment-lease-equipment-info', {
                url: 'contract/equipment/lease/equipment-lease-equipment-info',
                templateUrl: 'modules/contract/equipment/lease/equipment-info.html',
                controller: 'EquipmentLeaseEquipmentController'
            })
            .state('contract/equipment/lease/equipment-lease-charges-info', {
                url: 'contract/equipment/lease/equipment-lease-charges-info',
                templateUrl: 'modules/contract/equipment/lease/charges-info.html',
                controller: 'EquipmentLeaseChargesController'
            })
            .state('contract/equipment/lease/equipment-lease-invoice-info', {
                url: 'contract/equipment/lease/equipment-lease-invoice-info',
                templateUrl: 'modules/contract/equipment/lease/invoice-info.html',
                controller: 'EquipmentLeaseInvoiceController'
            })
    });
