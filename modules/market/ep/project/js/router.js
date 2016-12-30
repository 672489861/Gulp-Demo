angular.module('app.market.ep.project', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('market/ep/project/project-list', {
                url: 'market/ep/project/project-list',
                templateUrl: 'modules/market/ep/project/project-list.html',
                controller: 'ProjectListController'
            })
            .state('market/ep/project/project-detail', {
                url: 'market/ep/project/project-detail',
                templateUrl: 'modules/market/ep/project/project-detail.html',
                controller: 'ProjectDetailController',
                params: {dataId: 0}
            })
            .state('market/ep/project/project-attach-detail', {
                url: 'market/ep/project/project-attach-detail',
                templateUrl: 'modules/market/ep/project/project-attach-detail.html',
                controller: 'ProjectAttachDetailController',
                params: {attaches: []}
            })
            .state('market/ep/project/project-award-detail', {
                url: 'market/ep/project/project-award-detail',
                templateUrl: 'modules/market/ep/project/project-award-detail.html',
                controller: 'ProjectAwardDetailController',
                params: {award: null}
            })
            .state('market/ep/project/project-punish-detail', {
                url: 'market/ep/project/project-punish-detail',
                templateUrl: 'modules/market/ep/project/project-punish-detail.html',
                controller: 'ProjectPunishDetailController',
                params: {punish: null}
            })
        ;
    });
