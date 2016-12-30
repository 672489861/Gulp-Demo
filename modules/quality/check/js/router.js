angular.module('app.quality.check', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('quality/check/quality-list', {
                url: 'quality/check/quality-list',
                templateUrl: 'modules/quality/check/quality-list.html',
                controller: 'qualityCheckListController'
            })
            .state('quality/check/quality-detail', {
                url: 'quality/check/quality-detail',
                templateUrl: 'modules/quality/check/quality-detail.html',
                controller: 'qualityCheckDetailController',
                params: {id: null,backUrl: null}
            })
            .state('quality/check/quality-add', {
                url: 'quality/check/quality-add',
                templateUrl: 'modules/quality/check/quality-add.html',
                controller: 'qualityCheckAddController',
                params: {type: 'add', backUrl: null}
            })
            .state('quality/check/quality-solver', {
                url: 'quality/check/quality-solver',
                templateUrl: 'modules/quality/check/quality-solver.html',
                controller: 'qualityCheckSolverController',
                params: {backUrl: null}
            })
            .state('quality/check/quality-content', {
                url: 'quality/check/quality-content',
                templateUrl: 'modules/quality/check/quality-content.html',
                controller: 'qualityCheckContentController',
                params: {backUrl: null}
            })
            .state('quality/check/quality-content-problem', {
                url: 'quality/check/quality-content-problem',
                templateUrl: 'modules/quality/check/quality-content-problem.html',
                controller: 'qualityCheckContentProblemController',
                params: {type: null, id: null, backUrl: null}
            })
            .state('quality/check/quality-edit', {
                url: 'quality/check/quality-edit',
                templateUrl: 'modules/quality/check/quality-add.html',
                controller: 'qualityCheckEditController',
                params: {type: 'edit', id: null, backUrl: null}
            })
            .state('quality/check/quality-drafts-list', {
                url: 'quality/check/quality-drafts-list',
                templateUrl: 'modules/quality/check/quality-drafts-list.html',
                controller: 'qualityCheckDraftsListController'
            })
            .state('quality/check/quality-drafts-edit', {
                url: 'quality/check/quality-drafts-edit',
                templateUrl: 'modules/quality/check/quality-add.html',
                controller: 'qualityCheckDraftsEditController',
                params: {type: 'draft', id: null}
            })
            .state('quality/check/quality-solve', {
                url: 'quality/check/quality-solve',
                templateUrl: 'modules/quality/check/quality-solve.html',
                controller: 'qualityCheckSolveController',
                params: {id: null, backUrl: null}
            })
            .state('quality/check/quality-recheck', {
                url: 'quality/check/quality-recheck',
                templateUrl: 'modules/quality/check/quality-recheck.html',
                controller: 'qualityCheckRecheckController',
                params: {id: null, backUrl: null}
            })
            .state('quality/check/canvas', {
                url: 'quality/check/canvas',
                templateUrl: 'modules/quality/check/canvas.html',
                controller: 'qualityCheckCanvasController',
                params: {image: null, index: null, backUrl: null}
            });
    });
