/**
 * Created by zjw on 2016/9/11.
 */
angular.module('app.subcontract.merchant', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('subcontract/merchant/merchant-list', {
                url: 'subcontract/merchant/merchant-list',
                templateUrl: 'modules/subcontract/merchant/merchant-list.html',
                controller: 'MerchantListController'
            })
    });
