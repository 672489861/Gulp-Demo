angular.module('app.market.ep.project')
    .controller('ProjectDetailController', ['$scope', '$stateParams', '$state', 'ProjectService',
        function ($scope, $stateParams, $state, projectService) {
            $scope.projectInfo = true;
            $scope.projectInfoShow = function () {
                $scope.projectInfo = !$scope.projectInfo;
            };

            $scope.companyInfo = true;
            $scope.companyInfoShow = function () {
                $scope.companyInfo = !$scope.companyInfo;
            };

            $scope.projectOption = true;
            $scope.projectOptionShow = function () {
                $scope.projectOption = !$scope.projectOption;
            };

            $scope.attachment = true;
            $scope.attachmentShow = function () {
                $scope.attachment = !$scope.attachment;
            };

            $scope.employee = true;
            $scope.employeeShow = function () {
                $scope.employee = !$scope.employee;
            };
            $scope.award = true;
            $scope.awardShow = function () {
                $scope.award = !$scope.award
            };

            $scope.punish = true;
            $scope.punishShow = function () {
                $scope.punish = !$scope.punish
            };
            //项目主表
            projectService.loadPrjDetail($stateParams.dataId, function (data) {
                $scope.project = data;
            });
            //项目奖励
            projectService.getAward($stateParams.dataId, function (data) {
                $scope.awards = data;
            });

            //项目惩罚
            projectService.getPunish($stateParams.dataId, function (data) {
                $scope.punishes = data;
            });

            //查看项目人员详细
            $scope.viewEmpDetail = function (id) {
                $state.go('market/ep/employee/employee-detail', {dataId: id})
            };

            //项目参数
            projectService.getParam($stateParams.dataId, function (data) {
                $scope.params = data;
            });
            //项目附件
            $scope.attaches = [[], [], [], [], [], []];
            projectService.getProjectAttach($stateParams.dataId, function (data) {
                for (var i = 0; i < data.length; i++) {
                    var attach = data[i];
                    if (attach.url != '' || attach.name != '' || attach.orgId > 0) {
                        $scope.attaches[attach.typeId - 1].push(attach)
                    }
                }
            });

            $scope.viewAttachDetail = function (attaches) {
                if (attaches.length > 0) {
                    $state.go('market/ep/project/project-attach-detail', {attaches: attaches})
                }
            };

            $scope.viewAwardDetail = function (obj) {
                $state.go('market/ep/project/project-award-detail', {award: obj})
            };

            $scope.viewPunishDetail = function (obj) {
                $state.go('market/ep/project/project-punish-detail', {punish: obj})
            };
        }]);
