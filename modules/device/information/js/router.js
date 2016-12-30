angular.module('app.device.information', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('device/information/device-info-list', {
                url: 'device/information/device-info-list',
                templateUrl: 'modules/device/information/device-info-list.html',
                controller: 'DeviceListController'
            })
            .state('device/information/device-info-detail', {
                url: 'device/information/device-info-detail',
                templateUrl: 'modules/device/information/device-info-detail.html',
                controller: 'DeviceDetailController',
                params: {id: null}
            });
    });