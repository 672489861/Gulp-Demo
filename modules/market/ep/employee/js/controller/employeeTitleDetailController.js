angular.module('app.market.ep.employee')
    .controller('EmployeeTitleDetailController', ['$scope', '$stateParams', 'EmployeeService',
        function ($scope, $stateParams, employeeService) {
            $scope.attachment = true;
            $scope.attachmentShow = function () {
                $scope.attachment = !$scope.attachment;
            };
            $scope.title = $stateParams.title;
            employeeService.getTitleAttach($stateParams.title.titleid, function (data) {
                $scope.attaches = data;
            });
            $scope.download = function (attach) {
                employeeService.downloadAttach(attach);
            }

        }]);
