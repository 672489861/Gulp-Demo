/**
 * Created by zjw on 2016/9/11.
 */
angular.module('app.subcontract.merchant')
    .controller('MerchantListController', ['$scope', '$state', '$stateParams', 'MerchantListService', '$ionicModal', 'SubContractCommonService', '$ionicHistory',
        '$ionicScrollDelegate',
        function ($scope, $state, $stateParams, merchantListService, $ionicModal, subContractCommonService, $ionicHistory, $ionicScrollDelegate) {

            $scope.$on('$ionicView.loaded', function () {
                $scope.merchantList = merchantListService.getMerchantList();
                $scope.hasNextPage = merchantListService.hasNextPage();
                $scope.searchText = "";
            });

            $scope.loadListData = function () {
                merchantListService.loadListData(function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.fillData = function () {
                $scope.merchantList = merchantListService.getMerchantList();
                $scope.hasNextPage = merchantListService.hasNextPage();
            };

            $scope.refreshListData = function () {
                merchantListService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };

            $scope.back = function () {
                merchantListService.clearCachedData();
                $ionicHistory.goBack();
            };

            $scope.searchFilter = function (merchant) {
                if ($scope.searchText != null && $scope.searchText != "") {
                    return merchant.name.indexOf($scope.searchText) != -1;
                } else {
                    return true;
                }
            };

            $scope.clearSearchText = function(){
                $scope.searchText = "";
            };

        }]);