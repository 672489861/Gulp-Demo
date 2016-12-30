/**
 * Created by zjw on 2016/9/8.
 */
angular.module('app.subcontract.team')
    .controller('TeamListController', ['$scope', '$state', '$stateParams', 'TeamListService', '$ionicModal', 'SubContractCommonService', '$ionicHistory',
        '$ionicScrollDelegate',
        function ($scope, $state, $stateParams, teamListService, $ionicModal, subContractCommonService, $ionicHistory, $ionicScrollDelegate) {


            $scope.$on('$ionicView.loaded', function () {
                $scope.teamList = teamListService.getTeamList();
                $scope.hasNextPage = teamListService.hasNextPage();
                subContractCommonService.queryMerchantList(13002001, function (result) {
                    $scope.merchantList = result;
                });
                $scope.condition = teamListService.getCondition();
                $scope.searchText = "";
            });

            $scope.loadListData = function () {
                teamListService.loadListData(function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.fillData = function () {
                $scope.teamList = teamListService.getTeamList();
                $scope.hasNextPage = teamListService.hasNextPage();
            };

            $scope.refreshListData = function () {
                teamListService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };

            $scope.getClassName = function (worktypeId) {
                if (worktypeId <= 7) {
                    return "smart-mark royal-bg";
                } else if (worktypeId <= 15) {
                    return "smart-mark assertive-bg";
                } else {
                    return "smart-mark balanced-bg";
                }
            };

            $scope.back = function () {
                teamListService.clearCachedData();
                teamListService.resetCondition();
                $ionicHistory.goBack();
            };

            $scope.searchFilter = function (merchant) {
                if ($scope.searchText != null && $scope.searchText != "") {
                    return merchant.name.indexOf($scope.searchText) != -1;
                } else {
                    return true;
                }
            };

            $scope.clearCondition = function () {
                $scope.condition.name = "";
                $scope.condition.leaderName = "";
                $scope.condition.number = "";
                $scope.condition.merchantId = -1;
            };

            $scope.clearSearchText = function () {
                $scope.searchText = "";
            };

            // ==================Modal相关===================
            $scope.openQueryMerchant = function () {
                $scope.modalQueryMerchant.show();
            };

            $scope.openQueryMore = function () {
                $scope.modalQueryMore.show();
            };

            $scope.hideQueryMerchant = function (merchantId) {
                $scope.condition.merchantId = merchantId;
                $scope.search();
                $scope.modalQueryMerchant.hide();
            };

            $scope.hideQueryMore = function () {
                $scope.search();
                $scope.modalQueryMore.hide();
            };

            $scope.search = function () {
                teamListService.clearCachedData();
                $ionicScrollDelegate.scrollTop();
                $scope.loadListData();
            };

            $ionicModal.fromTemplateUrl('query-merchant.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryMerchant = modal;
            });

            $ionicModal.fromTemplateUrl('query-more.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryMore = modal;
            });
        }]);

