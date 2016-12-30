angular.module('app.market.ep.employee')
    .controller('EmployeeCertificateDetailController', ['$scope', '$stateParams', 'EmployeeService',
        function ($scope, $stateParams, employeeService, YT) {
            $scope.attachment = true;
            $scope.attachmentShow = function () {
                $scope.attachment = !$scope.attachment;
            };
            $scope.certificate = $stateParams.certificate;
            employeeService.getCertificateAttach($stateParams.certificate.certificateid, function (data) {
                $scope.attaches = data;
            });

            $scope.download = function (attach) {
                employeeService.downloadAttach(attach);
            }
        }]);
