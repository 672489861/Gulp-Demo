angular.module('app.device.maintain.maintain-record', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('device/maintain/maintain-record/maintain-record-list', {
                url: 'device/maintain/maintain-record/maintain-record-list',
                templateUrl: 'modules/device/maintain/maintain-record/maintain-record-list.html',
                controller: 'MaintainRecordListController',
                params: {success: false}
            })
            .state('device/maintain/maintain-record/maintain-device-detail', {
                url: 'device/maintain/maintain-record/maintain-device-detail',
                templateUrl: 'modules/device/maintain/maintain-record/maintain-device-detail.html',
                controller: 'MaintainRecordDetailController',
                params: {id: null}
            });
    });