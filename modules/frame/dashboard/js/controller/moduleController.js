angular.module('app.frame.dashboard')
    .controller('ModuleController', ['$scope', 'ModuleService', '$ionicPopup', 'UserService','$state', function ($scope, moduleService, $ionicPopup, userService,$state) {



        $scope.showCheckbox = function () {
            $state.go("/news/projectList");

            //$ionicPopup.show({
            //    templateUrl: 'modules/frame/dashboard/projectList.html',
            //    title: '请选择项目部',
            //    scope: $scope,
            //    buttons: [
            //        {
            //            text: '取消', onTap: function () {
            //            for (var i = 0; i < $scope.nowChooseSubModule.projects.length; i++) {
            //                $scope.nowChooseSubModule.projects[i].checked = false;
            //            }
            //            $scope.nowChooseSubModule.checked = false;
            //        }
            //        },
            //        {
            //            text: '<b>确认</b>',
            //            type: 'button-positive',
            //            onTap: function (e) {
            //                var flag = false;
            //                for (var i = 0; i < $scope.nowChooseSubModule.projects.length; i++) {
            //                    if ($scope.nowChooseSubModule.projects[i].checked) {
            //                        flag = true;
            //                        break;
            //                    }
            //                }
            //                // 当勾选1个包括1个以上的项目部时 就是选中状态
            //                $scope.nowChooseSubModule.checked = flag;
            //            }
            //        }
            //    ]
            //});

        };

    }]);