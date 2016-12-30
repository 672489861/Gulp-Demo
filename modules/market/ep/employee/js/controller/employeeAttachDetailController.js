angular.module('app.market.ep.employee')
    .controller('EmployeeAttachDetailController', ['$scope', 'EmployeeService', '$stateParams',
        function ($scope, employeeService, $stateParams) {
            $scope.attaches = $stateParams.attaches;

            $scope.download = function (attach) {
                employeeService.downloadAttach(attach);
            }
        }]);
