angular.module('app.merchant.information')
    .controller('MerchantInfoListController', ['$scope', '$state', '$ionicHistory', '$ionicModal', '$ionicScrollDelegate', 'MerchantService', '$ionicViewSwitcher',
        function ($scope, $state, $ionicHistory, $ionicModal, $ionicScrollDelegate, merchantService, $ionicViewSwitcher) {

        $scope.condition = merchantService.getCondition();


        $scope.$on('$ionicView.loaded', function () {
            $scope.merchantList = merchantService.getMerchantList();
            $scope.hasNextPage = merchantService.hasNextPage();
            merchantService.getMerchantTypeDetail(function(data){
                $scope.merchantTypeDetail = data;
            });
        });

        //加载数据
        $scope.loadListData = function () {
            merchantService.loadListData(function () {
                $scope.fillData();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        // 下拉刷新
        $scope.refreshListData = function () {
            merchantService.refreshListData(function () {
                $scope.fillData();
                $scope.$broadcast("scroll.refreshComplete");
            });
        };

        //填充数据
        $scope.fillData = function () {
            $scope.merchantList = merchantService.getMerchantList();
            $scope.hasNextPage = merchantService.hasNextPage();
        };

        //搜索数据
        $scope.searchType = function () {
            $scope.modalQueryTypeUp.hide();
            //根据查询条件查询结果集
            merchantService.clearCachedData();
            $ionicScrollDelegate.scrollTop();
            $scope.loadListData();
        };

        //搜索数据
        $scope.searchMore = function () {
            $scope.modalQueryMore.hide();
            //根据查询条件查询结果集
            merchantService.clearCachedData();
            $ionicScrollDelegate.scrollTop();
            $scope.loadListData();
        };

        $scope.back = function () {
            // 重置数据
            merchantService.clearCachedData();
            merchantService.resetCondition();
            //$ionicHistory.goBack();
            $state.go('menu');
            $ionicViewSwitcher.nextDirection("back");
        };

        // 重置统一社会信用代码
        $scope.clearUnifiedSocialCode = function () {
            $scope.condition.unifiedSocialCode = '';
        };

        // 重置身份证号和组织机构代码
        $scope.clearIdCode = function () {
            $scope.condition.code = '';
            $scope.condition.idCard = '';
        };

        // 重置更多筛选中的条件
        $scope.clearSearchMore = function () {
            $scope.condition.number = '';
            $scope.condition.name = '';
            $scope.condition.kindId = 0;
            $scope.condition.typeId = 0;
            $scope.condition.code = '';
            $scope.condition.idCard = '';
            $scope.condition.unifiedSocialCode = '';
            $scope.merchantTypeName = '';
        };

        //客商种类
        $scope.merchantTypeName = '';


        //查询条件
        //客商类型选择
        $ionicModal.fromTemplateUrl('query-type.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalQueryTypeUp = modal;
        });
        $scope.openQueryTypeUp = function () {
            $scope.modalQueryTypeUp.show();
        };
        $scope.hideQueryType = function () {
            $scope.modalQueryTypeUp.hide();
        };

        //更多删选
        $ionicModal.fromTemplateUrl('query-more.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalQueryMore = modal;
        });
        $scope.openQueryMore = function () {
            $scope.modalQueryMore.show();
        };

        //客商种类选择
        $scope.openKinds = function () {
            $scope.kinds = true;
        };
        $scope.close = function () {
            $scope.kinds = false;
        };
    }]);