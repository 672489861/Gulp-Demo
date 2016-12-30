angular.module('app.safety.multipleCheck', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('safety/multipleCheck/multipleCheck-list', {
                url: 'safety/multipleCheck/multipleCheck-list',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-list.html',
                controller:'multipleCheckListController'
            })
            .state('safety/multipleCheck/multipleCheck-item-list', {
                url: 'safety/multipleCheck/multipleCheck-item-list',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-item-list.html',
                controller:'multipleCheckItemListController',
                params:{projectId:null,backUrl:null,editId:null}
            })
            .state('safety/multipleCheck/multipleCheck-item-detail', {
                url: 'safety/multipleCheck/multipleCheck-item-detail',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-item-detail.html',
                controller:'multipleCheckItemDetailController',
                params:{id:null,backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-item-detail-random-info', {
                url: 'safety/multipleCheck/multipleCheck-item-detail-random-info',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-item-detail-random-info.html',
                controller:'multipleCheckItemDetailRandomInfoController',
                params:{id:null,backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-item-add', {
                url: 'safety/multipleCheck/multipleCheck-item-add',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-item-add.html',
                controller:'multipleCheckItemAddController',
                params:{projectId:null,backUrl:null,editId:null}
            })
            .state('safety/multipleCheck/multipleCheck-person-info-edit', {
                url: 'safety/multipleCheck/multipleCheck-person-info-edit',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-person-info-edit.html',
                controller:'multipleCheckPersonInfoEditController',
                params:{backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-project-info-edit', {
                url: 'safety/multipleCheck/multipleCheck-project-info-edit',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-project-info-edit.html',
                controller:'multipleCheckProjectInfoEditController',
                params:{backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-structure-type', {
                url: 'safety/multipleCheck/multipleCheck-structure-type',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-structure-type.html',
                controller:'multipleCheckStructureTypeController',
                params:{backUrl:null,preBackUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-project-status', {
                url: 'safety/multipleCheck/multipleCheck-project-status',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-project-status.html',
                controller:'multipleCheckProjectStatusController',
                params:{backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-advice-text', {
                url: 'safety/multipleCheck/multipleCheck-advice-text',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-advice-text.html',
                controller:'multipleCheckAdviceTextController',
                params:{backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-checker-list', {
                url: 'safety/multipleCheck/multipleCheck-checker-list',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-checker-list.html',
                controller:'multipleCheckCheckerListController',
                params:{backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-item-add-random-info', {
                url: 'safety/multipleCheck/multipleCheck-item-add-random-info',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-item-add-random-info.html',
                controller:'multipleCheckItemAddRandomInfoController',
                params:{backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-check-position', {
                url: 'safety/multipleCheck/multipleCheck-check-position',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-check-position.html',
                controller:'multipleCheckPositionController',
                params:{backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-content', {
                url: 'safety/multipleCheck/multipleCheck-content',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-content.html',
                controller:'multipleCheckContentController',
                params: {index:null,backUrl: null}
            })
            .state('safety/multipleCheck/multipleCheck-content-item', {
                url: 'safety/multipleCheck/multipleCheck-content-item',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-content-item.html',
                controller:'multipleCheckContentItemController',
                params: {index:null,id:null,backUrl: null}
            })
            .state('safety/multipleCheck/multipleCheck-content-item-problem', {
                url: 'safety/multipleCheck/multipleCheck-content-item-problem',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-content-item-problem.html',
                controller:'multipleCheckContentItemProblemController',
                params: {index:null,pId:null,id:null,backUrl: null}
            })
            .state('safety/multipleCheck/canvas', {
                url: 'safety/multipleCheck/canvas',
                templateUrl: 'modules/safety/multipleCheck/canvas.html',
                controller:'multipleCheckCanvasController',
                params: {editId:null,image:null,groupIndex:null,index:null,backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-item-edit', {
                url: 'safety/multipleCheck/multipleCheck-item-edit',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-item-add.html',
                controller:'multipleCheckItemEditController',
                params:{id:null,backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-storage-list', {
                url: 'safety/multipleCheck/multipleCheck-storage-list',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-storage-list.html',
                controller:'multipleCheckStorageListController',
                params:{projectId:null,backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-storage-edit', {
                url: 'safety/multipleCheck/multipleCheck-storage-edit',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-item-add.html',
                controller:'multipleCheckStorageEditController',
                params:{id:null,backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-detail-project-status', {
                url: 'safety/multipleCheck/multipleCheck-detail-project-status',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-detail-project-status.html',
                controller:'multipleCheckDetailProjectStatusController',
                params:{backUrl:null}
            })
            .state('safety/multipleCheck/multipleCheck-detail-advice-text', {
                url: 'safety/multipleCheck/multipleCheck-detail-advice-text',
                templateUrl: 'modules/safety/multipleCheck/multipleCheck-detail-advice-text.html',
                controller:'multipleCheckDetailAdviceTextController',
                params:{backUrl:null}
            });

    });
