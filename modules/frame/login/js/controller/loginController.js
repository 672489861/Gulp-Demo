angular.module('app.frame.login', ['app.config', 'com.yt.mui'])
    .controller('LoginController', ['LoginService', 'LocalStorageService', '$scope', '$ionicPopup', '$state', 'UserService', '$rootScope', '$stateParams', '$cordovaToast',
        function (loginService, localStorageService, $scope, $ionicPopup, $state, userService, $rootScope, $stateParams, $cordovaToast) {
            //不封装对象存在bug
            $scope.loginInfo = {
                username: '',
                password: '',
                rememberPassword: false,
                autoLogin: false
            };

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.openNotification = $stateParams.openNotification;
            });

            $scope.login = function () {
                loginService.loginCheck($scope.loginInfo.username, $scope.loginInfo.password).success(function (data) {
                    if (200 == data.status) {
                        if (data.object.orgList.length == 0) {
                            $ionicPopup.alert('您的账户未与组织机构关联，请联系管理员!');
                            return;
                        }
                        //缓存登陆用户信息
                        localStorageService.setObject("rememberPassword", $scope.loginInfo.rememberPassword);
                        localStorageService.setObject("tkt", data.object.ticket);
                        loginService.cacheUserInfo(data.object, $scope.loginInfo);
                        loginService.cacheCurrentUserInfo(function () {
                            document.addEventListener('deviceready', function () {
                                JPushTool.init({
                                    alias: userService.getUserId(),
                                    openNotification: function (data) {
                                        if (userService.getUserId() && userService.getRootOrgId()) {
                                            $rootScope.openPushMessage(data.extras.checkId, data.extras.module);
                                        } else {
                                            // 防止用户没登录点击推送
                                            localStorageService.set("notification", data);
                                            $cordovaToast.showShortCenter("请先登录应用！");
                                            $state.go("login", {openNotification: "true"});
                                        }
                                    }
                                });
                                JPushTool.isPushStopped(function () {
                                    JPushTool.resumePush();
                                });
                            }, false);
                            // 判断之前是否未登录时点击了 推送
                            if ($scope.openNotification == "true") {
                                $rootScope.openPushMessage(localStorageService.get("notification"));
                            }
                            $state.go('tabs.office', {login: "success"});
                        });
                    } else {
                        $ionicPopup.alert({title: '提示', template: '用户名或密码错误!'});
                    }
                }).error(function () {
                    $ionicPopup.alert({title: '提示', template: '服务器异常,请稍后重试!'});
                });
            };
        }
    ]);