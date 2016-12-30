angular.module('app.merchant.information', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('merchant/information/merchant-info-list', {
                url: 'merchant/information/merchant-info-list',
                templateUrl: 'modules/merchant/information/merchant-info-list.html',
                controller: 'MerchantInfoListController'
            })
            .state('merchant/information/merchant-info-detail', {
                url: 'merchant/information/merchant-info-detail',
                templateUrl: 'modules/merchant/information/merchant-info-detail.html',
                controller: 'MerchantInfoDetailController',
                params: {id: null}
            })
            .state('merchant/information/merchant-attachment-detail', {
                url: 'merchant/information/merchant-attachment-detail',
                templateUrl: 'modules/merchant/information/merchant-attachment-detail.html',
                controller: 'MerchantAttachmentDetailController',
                params: {merchantBaseAttachList:null}
            })
            .state('merchant/information/merchant-safety-permit-detail', {
                url: 'merchant/information/merchant-safety-permit-detail',
                templateUrl: 'modules/merchant/information/merchant-safety-permit-detail.html',
                controller: 'MerchantSafetyPermitDetailController',
                params: {merchantSafetyPermitDetail:null}
            })
            .state('merchant/information/merchant-qualification-detail', {
                url: 'merchant/information/merchant-qualification-detail',
                templateUrl: 'modules/merchant/information/merchant-qualification-detail.html',
                controller: 'MerchantQualificationDetailController',
                params: {merchantQualificationDetail:null}
            });
    });