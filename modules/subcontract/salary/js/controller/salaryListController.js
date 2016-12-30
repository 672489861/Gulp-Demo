/**
 * Created by zjw on 2016/9/10.
 */
angular.module('app.subcontract.salary')
    .controller('SalaryListController', ['$scope', '$state', '$stateParams', 'SalaryListService', '$ionicModal', 'SubContractCommonService', '$ionicHistory',
        '$ionicScrollDelegate',
        function ($scope, $state, $stateParams, salaryListService, $ionicModal, subContractCommonService, $ionicHistory, $ionicScrollDelegate) {

            $scope.$on('$ionicView.loaded', function () {
                $scope.salaryList = salaryListService.getSalaryList();
                $scope.hasNextPage = salaryListService.hasNextPage();
                subContractCommonService.queryTeamList(13002001, function (result) {
                    $scope.teamList = result;
                });
                subContractCommonService.queryWorkTypeList(13002001, function (result) {
                    $scope.workTypeList = result;
                });
                $scope.condition = salaryListService.getCondition();
            });

            $scope.loadListData = function () {
                salaryListService.loadListData(function () {
                    $scope.fillData();
                    // 查询本月合计工资发发放金额
                    $scope.total = salaryListService.getTotal();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.fillData = function () {
                $scope.salaryList = salaryListService.getSalaryList();
                $scope.hasNextPage = salaryListService.hasNextPage();
            };

            $scope.refreshListData = function () {
                salaryListService.refreshListData(function () {
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

            $scope.back = function () {
                salaryListService.clearCachedData();
                salaryListService.resetCondition();
                $ionicHistory.goBack();
            };

            $scope.search = function () {
                // 清除数据并回到顶部然后加载数据
                salaryListService.clearCachedData();
                $ionicScrollDelegate.scrollTop();
                $scope.loadListData();
            };

            $scope.clearSearchText = function () {
                $scope.condition.teamId = -1;
                $scope.condition.personName = "";
                $scope.condition.telphone = "";
                $scope.condition.idcard = "";
                $scope.condition.nativeplace = "";
                $scope.condition.age = "";
                $scope.condition.worktypeId = -1;
                $scope.condition.calcTypeId = -1;
                $scope.condition.worktypeName = "不限";
                $scope.condition.calcTypeName = "不限";
            };

            // =================Model相关===================
            $scope.openTeam = function () {
                $scope.modalTeams.show();
            };

            $ionicModal.fromTemplateUrl('query-team.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modalTeams = modal;
            });

            $scope.hideQueryTeam = function (teamId) {
                $scope.condition.teamId = teamId;
                $scope.search();
                $scope.modalTeams.hide();
            };

            $ionicModal.fromTemplateUrl('kinds.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modalKinds = modal;
            });


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
                $scope.condition.worktypeName = workTypeName;
                $scope.modalKinds.hide();
            };

            $scope.openCalcType = function () {
                $scope.calcType = true;
            };

            $scope.closeCalc = function (calcTypeId, calcTypeName) {
                $scope.condition.calcTypeId = calcTypeId;
                $scope.condition.calcTypeName = calcTypeName;
                $scope.calcType = false;
            };

            $scope.close = function () {
                $scope.calcType = false;
            };

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

        }]);