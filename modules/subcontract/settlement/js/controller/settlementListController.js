/**
 * Created by zjw on 2016/9/11.
 */
angular.module('app.subcontract.settlement')
    .controller('SettlementListController', ['$scope', '$state', '$stateParams', 'SettlementListService', '$ionicModal', 'SubContractCommonService', '$ionicHistory',
        '$ionicScrollDelegate', '$filter', '$ionicPopup',
        function ($scope, $state, $stateParams, settlementListService, $ionicModal, subContractCommonService, $ionicHistory, $ionicScrollDelegate, $filter, $ionicPopup) {

            $scope.$on('$ionicView.loaded', function () {
                $scope.settlementList = settlementListService.getSettlementList();
                $scope.hasNextPage = settlementListService.hasNextPage();
                subContractCommonService.queryContractList(13003003, function (result) {
                    $scope.contractList = result;
                });
                subContractCommonService.queryMerchantList(13002001, function (result) {
                    $scope.merchantList = result;
                });
                $scope.condition = settlementListService.getCondition();
            });

            $scope.loadListData = function () {
                console.info(1);
                settlementListService.loadListData(function () {
                    $scope.fillData();
                    // 查询合计
                    $scope.total = settlementListService.getTotal();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.fillData = function () {
                $scope.settlementList = settlementListService.getSettlementList();
                $scope.hasNextPage = settlementListService.hasNextPage();
            };

            $scope.refreshListData = function () {
                settlementListService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };

            $scope.search = function () {
                // 清除数据并回到顶部然后加载数据
                settlementListService.clearCachedData();
                $ionicScrollDelegate.scrollTop();
                $scope.loadListData();
            };

            $scope.clearSearchText = function () {
                $scope.condition.merchantId = -1;
                $scope.condition.contractId = -1;
                $scope.condition.settlementTimeBegin = "";
                $scope.condition.settlementTimeEnd = "";
                $scope.condition.merchantName = "不限";
            };

            $scope.back = function () {
                settlementListService.clearCachedData();
                settlementListService.resetCondition();
                $ionicHistory.goBack();
            };

            // ===============Modal相关=================
            $scope.openQueryContract = function () {
                $scope.modalQueryContract.show();
            };

            $ionicModal.fromTemplateUrl('query-contract.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryContract = modal;
            });

            $scope.hideQueryContract = function (contractId) {
                $scope.condition.contractId = contractId;
                $scope.search();
                $scope.modalQueryContract.hide();
            };

            $scope.openMerchant = function () {
                $scope.modalMerchant.show();
            };

            $ionicModal.fromTemplateUrl('merchant.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modalMerchant = modal;
            });

            $scope.hideMerchant = function (merchantId, merchantName) {
                $scope.condition.merchantId = merchantId;
                $scope.condition.merchantName = merchantName;
                $scope.modalMerchant.hide();
            };

            // ===============更多筛选===============
            $scope.openQueryMore = function () {
                $scope.modalQueryMore.show();
            };

            $ionicModal.fromTemplateUrl('query-more.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryMore = modal;
            });

            $scope.hideQueryMore = function () {
                $scope.search();
                $scope.modalQueryMore.hide();
            };

            //===================时间相关=================
            $scope.settlementTimeBegin = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.settlementTimeBegin = $filter('date')($scope.settlementTimeBegin.date, 'yyyy-MM-dd');
                    $scope.settlementTimerPopup.close();
                }
            });

            $scope.openInTimeBegin = function () {
                $scope.settlementTimerPopup = $ionicPopup.show({
                    templateUrl: "settlementTimeBegin.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.settlementTimerPopup.then(function (res) {
                });
            };

            $scope.settlementTimeEnd = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.settlementTimeEnd = $filter('date')($scope.settlementTimeEnd.date, 'yyyy-MM-dd');
                    $scope.settlementTimerPopup.close();
                }
            });

            $scope.openInTimeEnd = function () {
                $scope.settlementTimerPopup = $ionicPopup.show({
                    templateUrl: "settlementTimeEnd.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.settlementTimerPopup.then(function (res) {
                });
            };

        }]);