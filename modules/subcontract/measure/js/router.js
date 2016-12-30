/**
 * Created by zjw on 2016/9/11.
 */
angular.module('app.subcontract.measure', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('subcontract/measure/measure-list', {
                url: 'subcontract/measure/measure-list',
                templateUrl: 'modules/subcontract/measure/measure-list.html',
                controller: 'MeasureListController'
            }).state('subcontract/measure/measure-detail', {
                url: 'subcontract/measure/measure-detail',
                templateUrl: 'modules/subcontract/measure/measure-detail.html',
                controller: 'MeasureDetailController',
                params: {id: null}
            }).state('subcontract/measure/measure-contract-list', {
                url: 'subcontract/measure/measure-contract-list',
                templateUrl: 'modules/subcontract/measure/measure-contract-list.html',
                controller: 'MeasureContractListController',
                params: {
                    id: null,
                    merchantId: null,
                    merchantName: ""
                }
            }).state('subcontract/measure/measure-team-list', {
                url: 'subcontract/measure/measure-team-list',
                templateUrl: 'modules/subcontract/measure/measure-team-list.html',
                controller: 'MeasureTeamListController',
                params: {
                    id: null,
                    contractId: null,
                    contractName: ""
                }
            })
    });
