/**
 * Created by zjw on 2016/9/12.
 */
angular.module('app.subcontract.settlement')
    .controller('SettlementDetailController', ['$scope', '$state', '$stateParams', 'SettlementDetailService', "YTService", "$ionicHistory", "UserService", "env", "$cordovaToast",
        "$ionicPopup", "LocalStorageService", "$injector",
        function ($scope, $state, $stateParams, settlementDetailService, YTService, $ionicHistory, userService, env, $cordovaToast,
                  $ionicPopup, localStorageService, $injector) {

            $scope.$on('$ionicView.loaded', function () {
                // 基础信息
                settlementDetailService.getSettlement($stateParams.settlementId, function (data) {
                    $scope.settlement = data;
                });
                // 分包结算明细（合同内）
                settlementDetailService.getSettlementDetail($stateParams.settlementId, "合同内", function (data) {
                    $scope.settlementInDetails = data;
                    if ($scope.settlementInDetails.length == 0) {
                        $scope.hasInside = false;
                    } else {
                        // 获取合同内合计
                        $scope.settlementInTotal = settlementDetailService.getSettlementInTotal();
                        $scope.hasInside = true;
                    }
                });
                // 分包结算明细（合同外）
                settlementDetailService.getSettlementDetail($stateParams.settlementId, "合同外", function (data) {
                    $scope.settlementOutDetails = data;
                    if ($scope.settlementOutDetails.length == 0) {
                        $scope.hasOutside = false;
                    } else {
                        // 获取合同外合计
                        $scope.settlementOutTotal = settlementDetailService.getSettlementOutTotal();
                        $scope.hasOutside = true;
                    }
                });
                // 材料扣款明细
                settlementDetailService.getSettlementMaterialDeduction($stateParams.settlementId, function (data) {
                    $scope.settlementMaterialDeductions = data;
                    if ($scope.settlementMaterialDeductions.length == 0) {
                        $scope.hasMaterialDeduction = false;
                    } else {
                        // 获取材料扣款合计
                        $scope.deductionTotal = settlementDetailService.getDeductionTotal();
                        $scope.hasMaterialDeduction = true;
                    }
                });
                // 其他项目费用及金额
                settlementDetailService.getSettlementOtherExpenses($stateParams.settlementId, function (data) {
                    $scope.settlementOtherExpenses = data;
                    if ($scope.settlementOtherExpenses.length == 0) {
                        $scope.hasOtherExpense = false;
                    } else {
                        // 获取其他费用的三个合计
                        $scope.chargedTotal = settlementDetailService.getChargedTotal();
                        $scope.sumTotal = settlementDetailService.getSumTotal();
                        $scope.otherTotal = settlementDetailService.getOtherTotal();
                        $scope.hasOtherExpense = true;
                    }
                });
            });

            $scope.download = function (attach) {
                var url = attach.attachUrl.toLocaleLowerCase();
                var ticket = userService.getTicket();
                if (url.indexOf(".jpg") >= 0 || url.indexOf(".jpeg") >= 0 || url.indexOf(".png") >= 0 || url.indexOf(".bmp") >= 0 || url.indexOf(".gif") >= 0) {
                    url = attach.url.replace("\\", "/");
                    url = env.server + "download.action?rnd=" + Math.random() + "&tkt=" + ticket + "&fileName=" + url;
                    PhotoViewer.show(url);
                } else {
                    var confirmPopup = $ionicPopup.confirm({
                        title: '提示',
                        template: '该附件必须下载才能查看,确定下载么?',
                        cancelText: '取消',
                        okText: '确定'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            var obj = [{
                                name: attach.attachName,
                                url: attach.attachUrl
                            }];
                            downloadTool.init({
                                attachList: obj,
                                server: env.server,
                                injector: $injector,
                                open: true,
                                ticket: ticket,
                                storageService: localStorageService,
                                joinQueue: function (item) {
                                },
                                //（非必须） 正在下载的回调
                                startDownload: function () {
                                    $cordovaToast.showShortBottom("文件下载中,请稍后");
                                },
                                success: function (item, fileEntry) {
                                },
                                fail: function (item) {
                                    $ionicPopup.alert({title: '提示', template: item.name + '下载失败,请稍后再试!'});
                                }
                            });
                            downloadTool.download(obj[0]);
                        }
                    });
                }
            };

            $scope.back = function () {
                settlementDetailService.clearTotal();
                $ionicHistory.goBack();
            };

        }]);