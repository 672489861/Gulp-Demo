angular.module('app.market.ep.employee')
    .controller('EmployeeDetailController', ['$scope', 'EmployeeService', '$stateParams', '$state',
        function ($scope, employeeService, $stateParams, $state) {
            $scope.baseInfo = true;
            $scope.baseInfoShow = function () {
                $scope.baseInfo = !$scope.baseInfo;
            };

            $scope.workInfo = true;
            $scope.workInfoShow = function () {
                $scope.workInfo = !$scope.workInfo;
            };

            $scope.qualification = true;
            $scope.qualificationShow = function () {
                $scope.qualification = !$scope.qualification;
            };

            $scope.technicalTitle = true;
            $scope.technicalTitleShow = function () {
                $scope.technicalTitle = !$scope.technicalTitle;
            };

            $scope.project = true;
            $scope.projectShow = function () {
                $scope.project = !$scope.project;
            };
            employeeService.getEmployeeAttatch($stateParams.dataId, function (data) {
                $scope.attaches = data;
            });
            employeeService.loadEmpDetail($stateParams.dataId, function (data) {
                $scope.emp = data;
            });
            employeeService.getTitle($stateParams.dataId, function (data) {
                $scope.titles = data;
            });
            employeeService.getCertificate($stateParams.dataId, function (data) {
                $scope.certificates = data;
            });
            employeeService.getProjects($stateParams.dataId, function (data) {
                $scope.projects = data;
            });

            $scope.viewCertificateDetail = function (obj) {
                $state.go('market/ep/employee/employee-certificate-detail', {certificate: obj})
            };
            $scope.viewTitleDetail = function (obj) {
                $state.go('market/ep/employee/employee-title-detail', {title: obj})
            };
            $scope.viewAttachDetail = function () {
                if ($scope.attaches.length > 0) {
                    $state.go('market/ep/employee/employee-attach-detail', {attaches: $scope.attaches});
                }
            };
            $scope.viewPrjDetail = function (id) {
                $state.go('market/ep/project/project-detail', {dataId: id});
            }


        }]);
