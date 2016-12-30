/**
 * Created by zjw on 2016/10/25.
 */
angular.module('app.frame.dashboard')
    .controller('ProjectController', ['$scope', 'SubscribeModuleService', '$state',
        function ($scope, subscribeModuleService, $state) {

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.searchText = "";
                $scope.nowChooseSubModule = subscribeModuleService.getNowChooseSubModule();
                $scope.projects = subscribeModuleService.getProjects();
                $scope.hasNextPage = subscribeModuleService.hasNextPage();
            });

            $scope.clearSearchText = function () {
                $scope.searchText = "";
            };

            $scope.goBack = function () {
                subscribeModuleService.setModuleChecked();
                subscribeModuleService.clearCachedData();
                $state.go("subscribeModule");
            };

            $scope.confirmChoose = function () {
                subscribeModuleService.setChooseOrg($scope.projects);
                subscribeModuleService.clearCachedData();
                $state.go("subscribeModule");
            };

            $scope.setProjectsChecked = function () {
                for (var i = 0; i < $scope.projects.length; i++) {
                    for (var j = 0; j < $scope.nowChooseSubModule.projects.length; j++) {
                        if ($scope.nowChooseSubModule.projects[j].id == $scope.projects[i].id) {
                            if ($scope.nowChooseSubModule.projects[j].checked) {
                                $scope.projects[i].checked = true;
                            }
                            break;
                        }
                    }
                }
            };

            $scope.loadListData = function () {
                subscribeModuleService.loadProjectListData($scope.searchText, function () {
                    $scope.fillData();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.refreshListData = function () {
                $scope.searchText = "";
                subscribeModuleService.refreshProjectListData($scope.searchText, function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };

            $scope.search = function () {
                subscribeModuleService.clearCachedData();
                $scope.loadListData();
            };

            $scope.fillData = function () {
                $scope.projects = subscribeModuleService.getProjects();
                $scope.hasNextPage = subscribeModuleService.hasNextPage();
                $scope.setProjectsChecked();
            };

        }]);