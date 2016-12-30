/**
 * Created by zjw on 2016/9/8.
 */
angular.module('app.subcontract.person', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('subcontract/person/person-list', {
                url: 'subcontract/person/person-list',
                templateUrl: 'modules/subcontract/person/person-list.html',
                controller: 'PersonListController'
            }).state('subcontract/person/person-detail', {
                url: 'subcontract/person/person-detail',
                templateUrl: 'modules/subcontract/person/person-detail.html',
                controller: 'PersonDetailController',
                params: {personId: null}
            })
    });
