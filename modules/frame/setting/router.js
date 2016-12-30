angular.module('app.frame.setting', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('frame/setting/change-telephone', {
                url: 'frame/setting/change-telephone',
                templateUrl: 'modules/frame/setting/change-telephone.html',
                controller: 'ChangeTelephoneController'
            })
            .state('frame/setting/change-password', {
                url: 'frame/setting/change-password',
                templateUrl: 'modules/frame/setting/change-password.html',
                controller: 'ChangePasswordController'
            })
            .state('frame/setting/change-email', {
                url: 'frame/setting/change-email',
                templateUrl: 'modules/frame/setting/change-email.html',
                controller: 'ChangeEmailController'
            })
        ;
    });
