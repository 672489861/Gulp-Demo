angular.module('app.market.ep.employee', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('market/ep/employee/employee-list', {
                url: 'market/ep/employee/employee-list',
                templateUrl: 'modules/market/ep/employee/employee-list.html',
                controller: 'EmployeeListController'
            })
            .state('market/ep/employee/employee-detail', {
                url: 'market/ep/employee//employee-detail',
                templateUrl: 'modules/market/ep/employee/employee-detail.html',
                controller: 'EmployeeDetailController',
                params: {dataId: 0}
            })
            .state('market/ep/employee/employee-certificate-detail', {
                url: 'market/ep/employee/employee-certificate-detail',
                templateUrl: 'modules/market/ep/employee/employee-certificate-detail.html',
                controller: 'EmployeeCertificateDetailController',
                params: {certificate: null}
            })
            .state('market/ep/employee/employee-title-detail', {
                url: 'market/ep/employee/employee-title-detail',
                templateUrl: 'modules/market/ep/employee/employee-title-detail.html',
                controller: 'EmployeeTitleDetailController',
                params: {title: null}
            })
            .state('market/ep/employee/employee-attach-detail', {
                url: 'market/ep/employee/employee-attach-detail',
                templateUrl: 'modules/market/ep/employee/employee-attach-detail.html',
                controller: 'EmployeeAttachDetailController',
                params: {attaches: []}
            });
    });
