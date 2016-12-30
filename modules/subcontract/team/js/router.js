/**
 * Created by zjw on 2016/9/8.
 */
angular.module('app.subcontract.team', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('subcontract/team/team-list', {
                url: 'subcontract/team/team-list',
                templateUrl: 'modules/subcontract/team/team-list.html',
                controller: 'TeamListController'
            }).state('subcontract/team/team-detail', {
                url: 'subcontract/team/team-detail',
                templateUrl: 'modules/subcontract/team/team-detail.html',
                controller: 'TeamDetailController',
                params: {id: null}
            })
    });
