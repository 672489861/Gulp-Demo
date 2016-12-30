/**
 * Created by zjw on 2016/9/12.
 */
angular.module('app.subcontract.contract')
    .controller('ContractListController', ['$scope', '$state', '$stateParams', 'ContractListService', '$ionicModal', 'SubContractCommonService', '$ionicHistory',
        '$ionicScrollDelegate',
        function ($scope, $state, $stateParams, contractListService, $ionicModal, subContractCommonService, $ionicHistory, $ionicScrollDelegate) {

            $scope.$on('$ionicView.loaded', function () {
                $scope.contractList = contractListService.getContractList();
                $scope.hasNextPage = contractListService.hasNextPage();
                $scope.searchText = "";
            });

            $scope.loadListData = function () {
                contractListService.loadListData(function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.fillData = function () {
                $scope.contractList = contractListService.getContractList();
                $scope.hasNextPage = contractListService.hasNextPage();
            };

            $scope.refreshListData = function () {
                contractListService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };

            $scope.back = function () {
                contractListService.clearCachedData();
                $ionicHistory.goBack();
            };

            $scope.searchFilter = function (contract) {
                if ($scope.searchText != null && $scope.searchText != "") {
                    return contract.displayId.indexOf($scope.searchText) != -1;
                } else {
                    return true;
                }
            };

            $scope.clearSearchText = function(){
                $scope.searchText = "";
            };

        }]);
