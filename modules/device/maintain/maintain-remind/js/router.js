angular.module('app.device.maintain.maintain-remind', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('device/maintain/maintain-remind/maintain-remind-list', {
                url: 'device/maintain/maintain-remind/maintain-remind-list',
                templateUrl: 'modules/device/maintain/maintain-remind/maintain-remind-list.html',
                controller: 'MaintainRemindListController'
            })
            .state('device/maintain/maintain-remind/maintain-device-detail', {
                url: 'device/maintain/maintain-remind/maintain-device-detail',
                templateUrl: 'modules/device/maintain/maintain-remind/maintain-device-detail.html',
                controller: 'MaintainRemindDetailController',
                params: {id: null}
            })
            .state('device/maintain/maintain-remind/device-breakdown-deal', {
                url: 'device/maintain/maintain-remind/device-breakdown-deal',
                templateUrl: 'modules/device/maintain/maintain-remind/device-breakdown-deal.html',
                controller: 'DeviceBreakdownDealController',
                params: {id: null}
            });
    });