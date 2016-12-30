angular.module('app.quality.check')
    .controller('qualityCheckRecheckController', ['$scope', '$state', '$stateParams', 'qualityCheckService',
        '$ionicPopup', '$ionicViewSwitcher', '$ionicActionSheet', '$filter', 'UserService', 'env', 'YTService',
        function ($scope, $state, $stateParams, qualityCheckService,
                  $ionicPopup, $ionicViewSwitcher, $ionicActionSheet, $filter, userService, env, YTService) {
            $scope.detailInfo = {};
            $scope.$on('$ionicView.beforeEnter', function () {
                qualityCheckService.queryDetail($stateParams.id, function (data) {
                    $scope.detailInfo = data;
                    var now = new Date();
                    $scope.detailInfo.recheckDate = now.getFullYear() + '-' + qualityCheckService.prefixInteger(now.getMonth() + 1, 2) + '-' + qualityCheckService.prefixInteger(now.getDate(), 2);
                    $scope.detailInfo.recheckerName = qualityCheckService.getUserName();
                });
                qualityCheckService.queryDetailProblem($stateParams.id, function () {
                    $scope.contentList = qualityCheckService.getContent();
                });
                qualityCheckService.queryDetailCheckAttach($stateParams.id, function (data) {
                    $scope.checkAttach = data;
                    $scope.changeAttach($scope.checkAttach);
                });
                $scope.backUrl = $stateParams.backUrl || "quality/check/quality-list";
            });

            $scope.recheckDate = YTM.initDatePicker({
                callback: function () {
                    $scope.detailInfo.recheckDate = $filter('date')($scope.recheckDate.date, 'yyyy-MM-dd');
                    $scope.recheckDatePopup.close();
                }
            });
            $scope.openRecheckDate = function () {
                $scope.recheckDatePopup = $ionicPopup.show({
                    templateUrl: "check-date.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.recheckDatePopup.then(function (res) {
                    console.log('Tapped!', res);
                });
            };

            $scope.recheck = function (data) {
                $ionicActionSheet.show({
                    buttons: [
                        {text: '通过'},
                        {text: '不通过'}
                    ],
                    cancelText: '取消',
                    cancel: function () {
                        return true;
                    },
                    buttonClicked: function (index) {
                        if ($scope.check()) {
                            data.recheckerId = qualityCheckService.getUserId();
                            data.imagList = qualityCheckService.getImagList();

                            if (index == 0) {
                                qualityCheckService.solveAndRecheckData(data, 16001004, '通过', function () {
                                    $ionicPopup.alert({
                                        title: '提示',
                                        template: '<p class="text-center">您已通过该检查!</p>'
                                    }).then(function () {
                                        $state.go($scope.backUrl);
                                        $ionicViewSwitcher.nextDirection("back");
                                    });
                                });

                            } else if (index == 1) {
                                qualityCheckService.solveAndRecheckData(data, 16001004, '不通过', function () {
                                    $ionicPopup.alert({
                                        title: '提示',
                                        template: '<p class="text-center">您退回了该检查!</p>'
                                    }).then(function () {
                                        $state.go($scope.backUrl);
                                        $ionicViewSwitcher.nextDirection("back");
                                    });
                                });
                            }

                        }
                        return true;
                    }
                });
            };

            $scope.check = function () {
                var flag = true;
                if (qualityCheckService.getImagList().length <= 0) {
                    flag = false;
                    $ionicPopup.alert({
                        title: '验证',
                        template: '<p class="text-center">需要上传复查照片!</p>'
                    });
                }
                return flag;
            };

            $scope.back = function () {
                $state.go($scope.backUrl);
                $ionicViewSwitcher.nextDirection("back");
            };
            $scope.changeAttach = function (list) {
                if (list.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        var ticket = userService.getTicket();
                        list[i].src = list[i].url.replace("\\", "/");
                        list[i].src = env.server + "download.action?rnd=" + Math.random() + "&tkt=" + ticket + "&fileName=" + list[i].src;
                    }
                }
            };

            $scope.preview = function (imgIndex, arr) {
                $ionicActionSheet.show({
                    buttons: [
                        {text: '预览'}
                    ],
                    cancelText: '关闭',
                    cancel: function () {
                        return true;
                    },
                    buttonClicked: function () {
                        PhotoViewer.show(arr[imgIndex].src);
                        return true;
                    }
                });
            };

            $scope.image_list = [];
            $scope.addAttachment = function () {
                YTService.addAttachment($scope, function (item) {
                    $scope.image_list.push(item);
                    qualityCheckService.setImagList($scope.image_list);
                });
            };
            $scope.previewOrDelete = function (imgIndex) {
                YTService.previewOrDelete(imgIndex, $scope.image_list, function () {
                    $state.go('quality/check/canvas', {
                        image: $scope.image_list[imgIndex],
                        index: imgIndex,
                        backUrl: $scope.url
                    });
                    $ionicViewSwitcher.nextDirection("forward");
                });
                qualityCheckService.setImagList($scope.image_list);
            };

            $scope.preview = function (imgIndex, arr) {
                qualityCheckService.preview(imgIndex, arr);
            };
        }]);