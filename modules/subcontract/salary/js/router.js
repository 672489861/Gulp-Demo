/**
 * Created by zjw on 2016/9/10.
 */
angular.module('app.subcontract.salary', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('subcontract/salary/salary-list', {
                url: 'subcontract/salary/salary-list',
                templateUrl: 'modules/subcontract/salary/salary-list.html',
                controller: 'SalaryListController'
            }).state('subcontract/salary/salary-detail', {
                url: 'subcontract/salary/salary-detail',
                templateUrl: 'modules/subcontract/salary/salary-detail.html',
                controller: 'SalaryDetailController',
                params: {personId: null}
            })
    });