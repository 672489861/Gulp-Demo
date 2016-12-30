/**
 * Created by zjw on 2016/9/11.
 */
angular.module('app.subcontract.settlement', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('subcontract/settlement/settlement-list', {
                url: 'subcontract/settlement/settlement-list',
                templateUrl: 'modules/subcontract/settlement/settlement-list.html',
                controller: 'SettlementListController'
            }).state('subcontract/settlement/settlement-detail', {
                url: 'subcontract/settlement/settlement-detail',
                templateUrl: 'modules/subcontract/settlement/settlement-detail.html',
                controller: 'SettlementDetailController',
                params: {settlementId: null}
            })
    });