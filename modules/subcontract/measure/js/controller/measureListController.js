/**
 * Created by zjw on 2016/9/11.
 */
angular.module('app.subcontract.measure')
    .controller('MeasureListController', ['$scope', '$state', '$stateParams', 'MeasureListService', '$ionicModal', 'SubContractCommonService', '$ionicHistory',
        '$ionicScrollDelegate',
        function ($scope, $state, $stateParams, measureListService, $ionicModal, subContractCommonService, $ionicHistory, $ionicScrollDelegate) {

            $scope.$on('$ionicView.loaded', function () {
                $scope.measureList = measureListService.getMeasureList();
                $scope.hasNextPage = measureListService.hasNextPage();
            });

            $scope.loadListData = function () {
                measureListService.loadListData(function () {
                    $scope.fillData();
                    $scope.total = measureListService.getTotal();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.fillData = function () {
                $scope.measureList = measureListService.getMeasureList();
                $scope.hasNextPage = measureListService.hasNextPage();
            };

            $scope.refreshListData = function () {
                measureListService.refreshListData(function () {
                    $scope.fillData();
                    $scope.total = measureListService.getTotal();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };

            $scope.back = function () {
                measureListService.clearCachedData();
                $ionicHistory.goBack();
            };

        }]);