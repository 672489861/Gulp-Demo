//所有模块的加载
angular.module('app.frame', [
    'ionic',
    'app.frame.login',
    'app.frame.office',
    'app.frame.setting',
    'app.frame.dashboard'
]);

angular.module('app.frame')
//全局的样式默认UI样式修改
    .config(function ($ionicConfigProvider) {
        //配置tabs的位置和样式
        $ionicConfigProvider.tabs.position("bottom");
        $ionicConfigProvider.tabs.style("standard ");
    })
    //frame的路由配置
    .config(function ($stateProvider, $urlRouterProvider) {
        //设置框架的路由
        $stateProvider
            .state('tabs', {
                url: '/tabs',
                abstract: true,
                templateUrl: 'modules/frame/tabs/tabs.html',
                controller: 'OfficeController'
            })
            .state('tabs.dashboard', {
                url: '/dashboard',
                cache: false,
                views: {
                    'dashboard': {
                        templateUrl: 'modules/frame/dashboard/dashboard.html',
                        controller: 'DashboardController'
                    }
                },
                params: {
                    noRefresh: null
                }
            })
            .state('tabs.phone', {
                url: '/phone',
                views: {
                    'phone': {
                        templateUrl: 'modules/frame/phone/phone.html'
                    }
                }
            })
            .state('tabs.office', {
                url: '/office',
                views: {
                    'office': {
                        templateUrl: 'modules/frame/office/office.html',
                        controller: 'OfficeController'
                    }
                }
            })
            .state('tabs.setting', {
                url: '/setting',
                views: {
                    'setting': {
                        templateUrl: 'modules/frame/setting/setting.html',
                        controller: 'SettingController'
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'modules/frame/login/login.html',
                controller: 'LoginController'
            }).state('subscribeModule', {
                url: '/subscribeModule',
                templateUrl: 'modules/frame/dashboard/choose-modal.html',
                controller: 'SubscribeModuleController'
            }).state('chooseProject', {
                url: '/news/chooseProject',
                templateUrl: ' modules/frame/dashboard/projectList.html',
                controller: 'ProjectController'
            }).state('businessManagement', {
                url: '/dashboard/businessManagement',
                templateUrl: ' modules/frame/dashboard/businessManagement.html',
                controller: 'BusinessManagementController'
            }).state('projectManagement', {
                url: '/dashboard/projectManagement',
                templateUrl: ' modules/frame/dashboard/projectManagement.html',
                controller: 'ProjectManagementController'
            });

        //配置意外的跳转
        $urlRouterProvider.otherwise('/login');
    });