angular.module('app.device.inspection.inspection-record', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('device/inspection/inspection-record/inspection-record-list', {
                url: 'device/inspection/inspection-record/inspection-record-list',
                templateUrl: 'modules/device/inspection/inspection-record/inspection-record-list.html',
                controller: 'InspectionRecordListController',
                params:{success:false}
            })
            .state('device/inspection/inspection-record/inspection-device-detail', {
                url: 'device/inspection/inspection-record/inspection-device-detail',
                templateUrl: 'modules/device/inspection/inspection-record/inspection-device-detail.html',
                controller: 'InspectionRecordDetailController',
                params: {id: null}
            });
    });