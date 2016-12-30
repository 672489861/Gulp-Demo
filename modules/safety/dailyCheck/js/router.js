angular.module('app.safety.dailyCheck', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('safety/dailyCheck/dailyCheck-list', {
                url: 'safety/dailyCheck/dailyCheck-list',
                templateUrl: 'modules/safety/dailyCheck/dailyCheck-list.html',
                controller:'dailyCheckListController'
            })
            .state('safety/dailyCheck/dailyCheck-detail', {
                url: 'safety/dailyCheck/dailyCheck-detail',
                templateUrl: 'modules/safety/dailyCheck/dailyCheck-detail.html',
                controller:'dailyCheckDetailController',
                params: {id: null,backUrl: null}
            })
            .state('safety/dailyCheck/dailyCheck-add', {
                url: 'safety/dailyCheck/dailyCheck-add',
                templateUrl: 'modules/safety/dailyCheck/dailyCheck-add.html',
                controller:'dailyCheckAddController',
                params:{type:'add',backUrl: null}
            })
            .state('safety/dailyCheck/dailyCheck-position', {
                url: 'safety/dailyCheck/dailyCheck-position',
                templateUrl: 'modules/safety/dailyCheck/dailyCheck-position.html',
                controller:'dailyCheckPositionController',
                params: {backUrl: null}
            })
            .state('safety/dailyCheck/dailyCheck-solver', {
                url: 'safety/dailyCheck/dailyCheck-solver',
                templateUrl: 'modules/safety/dailyCheck/dailyCheck-solver.html',
                controller:'dailyCheckSolverController',
                params: {backUrl: null}
            })
            .state('safety/dailyCheck/dailyCheck-content', {
                url: 'safety/dailyCheck/dailyCheck-content',
                templateUrl: 'modules/safety/dailyCheck/dailyCheck-content.html',
                controller:'dailyCheckContentController',
                params: {backUrl: null}
            })
            .state('safety/dailyCheck/dailyCheck-content-item', {
                url: 'safety/dailyCheck/dailyCheck-content-item',
                templateUrl: 'modules/safety/dailyCheck/dailyCheck-content-item.html',
                controller:'dailyCheckContentItemController',
                params: {id:null,backUrl: null}
            })
            .state('safety/dailyCheck/dailyCheck-content-item-problem', {
                url: 'safety/dailyCheck/dailyCheck-content-item-problem',
                templateUrl: 'modules/safety/dailyCheck/dailyCheck-content-item-problem.html',
                controller:'dailyCheckContentItemProblemController',
                params: {type:null,pId:null,id:null,backUrl: null}
            })
            .state('safety/dailyCheck/dailyCheck-edit', {
                url: 'safety/dailyCheck/dailyCheck-edit',
                templateUrl: 'modules/safety/dailyCheck/dailyCheck-add.html',
                controller:'dailyCheckEditController',
                params:{type:'edit',id:null,backUrl: null}
            })
            .state('safety/dailyCheck/dailyCheck-drafts-list', {
                url: 'safety/dailyCheck/dailyCheck-drafts-list',
                templateUrl: 'modules/safety/dailyCheck/dailyCheck-drafts-list.html',
                controller:'dailyCheckDraftsListController'
            })
            .state('safety/dailyCheck/dailyCheck-drafts-edit', {
                url: 'safety/dailyCheck/dailyCheck-drafts-edit',
                templateUrl: 'modules/safety/dailyCheck/dailyCheck-add.html',
                controller:'dailyCheckDraftsEditController',
                params:{type:'draft',id:null}
            })
            .state('safety/dailyCheck/dailyCheck-solve', {
                url: 'safety/dailyCheck/dailyCheck-solve',
                templateUrl: 'modules/safety/dailyCheck/dailyCheck-solve.html',
                controller:'dailyCheckSolveController',
                params: {id: null,backUrl: null}
            })
            .state('safety/dailyCheck/dailyCheck-recheck', {
                url: 'safety/dailyCheck/dailyCheck-recheck',
                templateUrl: 'modules/safety/dailyCheck/dailyCheck-recheck.html',
                controller:'dailyCheckRecheckController',
                params: {id: null,backUrl: null}
            })
            .state('safety/dailyCheck/canvas', {
                url: 'safety/dailyCheck/canvas',
                templateUrl: 'modules/safety/dailyCheck/canvas.html',
                controller:'dailyCheckCanvasController',
                params: {image:null,index:null,backUrl:null}
            });
    });
