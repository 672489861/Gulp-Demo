angular.module('app.contract.account')
    .controller('accountListController', ['$scope', '$state', '$ionicViewSwitcher', 'AccountService',
        function ($scope, $state, $ionicViewSwitcher, AccountService) {

        $scope.filterFlag = false;

        $scope.$on('$ionicView.loaded', function () {
            $scope.condition.searchText = "";
            $scope.accountList = AccountService.getServiceData();
            $scope.hasNextPage = AccountService.hasNextPage();
        });

        //加载数据
        $scope.loadListData = function () {
            AccountService.loadListData(function () {
                $scope.fillData();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        // 下拉刷新
        $scope.refreshListData = function () {
            AccountService.refreshListData(function () {
                $scope.fillData();
                $scope.$broadcast("scroll.refreshComplete");
            });
        };

        //填充数据
        $scope.fillData = function () {
            $scope.accountList = AccountService.getServiceData();
            $scope.hasNextPage = AccountService.hasNextPage();
        };

        $scope.condition = AccountService.getCondition();

        $scope.resetFilter = function () {
            $scope.filterFlag = true;
        };

        $scope.searchFilter = function (value) {
            var returnFlag = true;
            if ($scope.condition.searchText != "" || $scope.condition.searchText != null) {
                var flag1 = value.displayId.indexOf($scope.condition.searchText) >= 0,
                    flag2 = value.projectName.indexOf($scope.condition.searchText) >= 0,
                    flag3 = value.orgName.indexOf($scope.condition.searchText) >= 0;
                returnFlag = flag1 || flag2 || flag3;
            }
            if (returnFlag) {
                $scope.filterFlag = false;
            }
            return returnFlag;
        };

        $scope.clearSearchText = function () {
            $scope.condition.searchText = "";
        };

        $scope.back = function () {
            $state.go('menu');
            $ionicViewSwitcher.nextDirection("back");
        };
    }]);
