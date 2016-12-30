/**
 * Created by zjw on 2016/9/8.
 */
angular.module('app.subcontract.person')
    .controller('PersonListController', ['$scope', '$state', '$stateParams', 'PersonListService', '$ionicModal', 'SubContractCommonService', '$ionicHistory',
        '$ionicScrollDelegate', 'YTService', '$ionicPopup', '$filter',
        function ($scope, $state, $stateParams, personListService, $ionicModal, subContractCommonService, $ionicHistory, $ionicScrollDelegate, ytService, $ionicPopup,
                  $filter) {

            $scope.$on('$ionicView.loaded', function () {
                $scope.personList = personListService.getPersonList();
                $scope.hasNextPage = personListService.hasNextPage();
                subContractCommonService.queryMerchantList(13002001, function (result) {
                    $scope.merchantList = result;
                });
                subContractCommonService.queryTeamList(13002001, function (result) {
                    $scope.teamList = result;
                });
                subContractCommonService.queryWorkTypeList(13002001, function (result) {
                    $scope.workTypeList = result;
                });
                $scope.condition = personListService.getCondition();
            });

            $scope.loadListData = function () {
                personListService.loadListData(function () {
                    $scope.fillData();
                    // 查询合计人数
                    $scope.recordCount = personListService.getRecordCount();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.fillData = function () {
                $scope.personList = personListService.getPersonList();
                $scope.hasNextPage = personListService.hasNextPage();
            };

            $scope.refreshListData = function () {
                personListService.refreshListData(function () {
                    $scope.fillData();
                    $scope.$broadcast("scroll.refreshComplete");
                });
            };

            $scope.getClassName = function (worktypeId) {
                if (worktypeId <= 7) {
                    return "smart-mark royal-bg";
                } else if (worktypeId <= 15) {
                    return "smart-mark assertive-bg";
                } else {
                    return "smart-mark balanced-bg";
                }
            };

            $scope.search = function () {
                // 清除数据并回到顶部然后加载数据
                personListService.clearCachedData();
                $ionicScrollDelegate.scrollTop();
                $scope.loadListData();
            };

            $scope.clearSearchText = function () {
                $scope.condition.merchantId = -1;
                $scope.condition.name = "";
                $scope.condition.telphone = "";
                $scope.condition.idcard = "";
                $scope.condition.nativeplace = "";
                $scope.condition.age = "";
                $scope.condition.worktypeId = -1;
                $scope.condition.special = -1;
                $scope.condition.id = -1;
                $scope.condition.name = "";
                $scope.condition.inTimeBegin = "";
                $scope.condition.inTimeEnd = "";
                $scope.condition.outTimeBegin = "";
                $scope.condition.outTimeEnd = "";
                $scope.condition.workTypeName = "全部";
                $scope.condition.teamName = "全部";
                $scope.condition.isspecial = "不限";
            };

            $scope.back = function () {
                personListService.clearCachedData();
                personListService.resetCondition();
                $ionicHistory.goBack();
            };

            // ===============Modal相关=================
            $scope.openQueryMerchant = function () {
                $scope.modalQueryMerchant.show();
            };

            $ionicModal.fromTemplateUrl('query-merchant.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryMerchant = modal;
            });

            $scope.hideQueryMerchant = function (merchantId) {
                $scope.condition.merchantId = merchantId;
                $scope.search();
                $scope.modalQueryMerchant.hide();
            };

            // ===============更多筛选===============
            $scope.openQueryMore = function () {
                $scope.modalQueryMore.show();
            };

            $ionicModal.fromTemplateUrl('query-more.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalQueryMore = modal;
            });

            $scope.hideQueryMore = function () {
                $scope.search();
                $scope.modalQueryMore.hide();
            };


            $scope.openKinds = function () {
                $scope.modalKinds.show();
            };

            $ionicModal.fromTemplateUrl('kinds.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modalKinds = modal;
            });

            $scope.hideKinds = function (worktypeId, workTypeName) {
                $scope.condition.worktypeId = worktypeId;
                $scope.condition.workTypeName = workTypeName;
                $scope.modalKinds.hide();
            };

            $scope.openGroup = function () {
                $scope.modalGroup.show();
            };

            $ionicModal.fromTemplateUrl('group.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modalGroup = modal;
            });

            $scope.hideGroup = function (teamId, teamName) {
                $scope.condition.id = teamId;
                $scope.condition.teamName = teamName;
                $scope.modalGroup.hide();
            };

            $scope.openIsSpecial = function () {
                $scope.isSpecial = true;
            };

            $scope.closeIsSpecial = function (isspecial) {
                $scope.condition.special = isspecial;
                if (isspecial == -1) {
                    $scope.condition.isspecial = "不限";
                } else if (isspecial == 0) {
                    $scope.condition.isspecial = "否";
                } else {
                    $scope.condition.isspecial = "是";
                }
                $scope.isSpecial = false;
            };

            $scope.close = function(){
                $scope.isSpecial = false;
            };

            //===================时间相关=================
            $scope.inTimeBegin = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.inTimeBegin = $filter('date')($scope.inTimeBegin.date, 'yyyy-MM-dd');
                    $scope.inTimerPopup.close();
                }
            });

            $scope.openInTimeBegin = function () {
                $scope.inTimerPopup = $ionicPopup.show({
                    templateUrl: "inTimeBegin.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.inTimerPopup.then(function (res) {
                });
            };

            $scope.inTimeEnd = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.inTimeEnd = $filter('date')($scope.inTimeEnd.date, 'yyyy-MM-dd');
                    $scope.inTimerPopup.close();
                }
            });

            $scope.openInTimeEnd = function () {
                $scope.inTimerPopup = $ionicPopup.show({
                    templateUrl: "inTimeEnd.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.inTimerPopup.then(function (res) {
                });
            };


            $scope.outTimeBegin = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.outTimeBegin = $filter('date')($scope.outTimeBegin.date, 'yyyy-MM-dd');
                    $scope.outimerPopup.close();
                }
            });

            $scope.openOutTimeBegin = function () {
                $scope.outimerPopup = $ionicPopup.show({
                    templateUrl: "outTimeBegin.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.outimerPopup.then(function (res) {
                });
            };

            $scope.outTimeEnd = YTM.initDatePicker({
                callback: function () {
                    $scope.condition.outTimeEnd = $filter('date')($scope.outTimeEnd.date, 'yyyy-MM-dd');
                    $scope.outimerPopup.close();
                }
            });

            $scope.openOutTimeEnd = function () {
                $scope.outimerPopup = $ionicPopup.show({
                    templateUrl: "outTimeEnd.html",
                    scope: $scope,
                    cssClass: 'customTimerPopover'
                });
                $scope.outimerPopup.then(function (res) {
                    console.log('Tapped!', res);
                });
            };

        }]);
