/**
 * Created by zjw on 2016/9/12.
 */
angular.module('app.subcontract.contract', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('subcontract/contract/contract-list', {
                url: 'subcontract/contract/contract-list',
                templateUrl: 'modules/subcontract/contract/contract-list.html',
                controller: 'ContractListController'
            })
    });
