angular.module('app.device.inspection.inspection-remind', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('device/inspection/inspection-remind/inspection-remind-list', {
                url: 'device/inspection/inspection-remind/inspection-remind-list',
                templateUrl: 'modules/device/inspection/inspection-remind/inspection-remind-list.html',
                controller: 'InspectionRemindListController'
            })
            .state('device/inspection/inspection-remind/inspection-device-detail', {
                url: 'device/inspection/inspection-remind/inspection-device-detail',
                templateUrl: 'modules/device/inspection/inspection-remind/inspection-device-detail.html',
                controller: 'InspectionRemindDetailController',
                params: {id: null}
            });
    });