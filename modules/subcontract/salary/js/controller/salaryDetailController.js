/**
 * Created by zjw on 2016/9/11.
 */
angular.module('app.subcontract.salary')
    .controller('SalaryDetailController', ['$scope', '$state', '$stateParams', 'SalaryDetailService', 'UserService', 'PersonDetailService',
        function ($scope, $state, $stateParams, salaryDetailService, userService, personDetailService) {

            $scope.$on('$ionicView.loaded', function () {
                // 基本信息
                personDetailService.getPersonDetail($stateParams.personId, function (data) {
                    $scope.personDetail = data;
                });
                // 查询工资发放历史记录
                salaryDetailService.getSalaryDetail($stateParams.personId, function (data) {
                    $scope.salaryDetails = data;
                })
            });

        }]);