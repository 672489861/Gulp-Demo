/**
 * Created by zjw on 2016/10/25.
 */
angular.module('app.frame.dashboard')
    .controller('SubscribeModuleController', ['$scope', '$state', 'UserService', 'YTService', '$ionicPopup', 'SubscribeModuleService',
        function ($scope, $state, userService, ytService, $ionicPopup, subscribeModuleService) {

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.getModules();
            });

            $scope.getModules = function () {
                $scope.type = subscribeModuleService.getMaxTypeObj().type;
                $scope.businessModules = subscribeModuleService.getCloneBusinessModules();
                $scope.projectModules = subscribeModuleService.getCloneProjectModules();
            };

            $scope.goBack = function () {
                subscribeModuleService.cloneModules();
                $state.go("tabs.dashboard");
            };

            $scope.closeModal = function () {
                subscribeModuleService.cloneModules();
                $state.go("tabs.dashboard");
            };

            $scope.save = function () {
                subscribeModuleService.save($scope, function () {
                    $state.go("tabs.dashboard");
                });
            };

            $scope.clickWrapModule = function (wrapModule, moduleStr) {
                if (moduleStr == "businessModules") {
                    for (var i = 0; i < $scope.businessModules.length; i++) {
                        var businessModule = $scope.businessModules[i];
                        if (businessModule.moduleId == wrapModule.moduleId) {
                            for (var j = 0; j < businessModule.subModules.length; j++) {
                                var subModule = businessModule.subModules[j];
                                for (var k = 0; k < subModule.length; k++) {
                                    subModule[k].checked = businessModule.checked;
                                }
                            }
                            break;
                        }
                    }
                } else {
                    for (var i = 0; i < $scope.projectModules.length; i++) {
                        var projectModule = $scope.projectModules[i];
                        if (projectModule.moduleId == wrapModule.moduleId) {
                            for (var j = 0; j < projectModule.subModules.length; j++) {
                                var projectSubModule = projectModule.subModules[j];
                                for (var k = 0; k < projectSubModule.length; k++) {
                                    projectSubModule[k].checked = projectModule.checked;
                                }
                            }
                            break;
                        }
                    }
                    subscribeModuleService.setNowChooseSubModule(wrapModule);
                    if ($scope.type < 3) {
                        $state.go("chooseProject");
                    }
                }
            };

            $scope.clickSubModule = function (wrapModule, moduleStr, subModule) {
                if (moduleStr == "businessModules") {
                    for (var i = 0; i < $scope.businessModules.length; i++) {
                        var businessModule = $scope.businessModules[i];
                        if (businessModule.moduleId == wrapModule.moduleId) {
                            var uncheckedCount = 0;
                            for (var j = 0; j < businessModule.subModules.length; j++) {
                                var subModule = businessModule.subModules[j];
                                for (var k = 0; k < subModule.length; k++) {
                                    if (!subModule[k].checked) {
                                        uncheckedCount++;
                                    }
                                }
                            }
                            businessModule.checked = !uncheckedCount > 0;
                            break;
                        }
                    }
                } else {
                    for (var i = 0; i < $scope.projectModules.length; i++) {
                        var projectModule = $scope.projectModules[i];
                        if (projectModule.moduleId == wrapModule.moduleId) {
                            var uncheckedCount = 0;
                            for (var j = 0; j < projectModule.subModules.length; j++) {
                                var projectSubModule = projectModule.subModules[j];
                                for (var k = 0; k < projectSubModule.length; k++) {
                                    if (!projectSubModule[k].checked) {
                                        uncheckedCount++;
                                    }
                                }
                            }
                            projectModule.checked = !uncheckedCount > 0;
                            break;
                        }
                    }
                    subscribeModuleService.setNowChooseSubModule(subModule);
                    if ($scope.type < 3) {
                        $state.go("chooseProject");
                    }
                }
            };
        }]);