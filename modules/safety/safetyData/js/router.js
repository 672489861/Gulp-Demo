angular.module('app.safety.safetyData', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('safety/safetyData/safetyData-list', {
                url: 'safety/safetyData/safetyData-list',
                templateUrl: 'modules/safety/safetyData/safetyData-list.html',
                controller:'SafetyDataListController'
            })
            .state('safety/safetyData/safetyData-detail', {
                url: 'safety/safetyData/safetyData-detail',
                templateUrl: 'modules/safety/safetyData/safetyData-detail.html',
                params:{data:null},
                controller:'SafetyDataDetailController'
            })
            .state('safety/safetyData/safetyData-kinds-detail', {
                url: 'safety/safetyData/safetyData-kinds-detail',
                templateUrl: 'modules/safety/safetyData/safetyData-kinds-detail.html',
                params:{subs:[]},
                controller:'SafetyDataKindsDetailController'
            });
    });
