angular.module('app.contract.account')
    .controller('accountDetailController', ['$scope', '$stateParams', 'AccountService',
        function ($scope, $stateParams, AccountService) {

            $scope.projectInfo = true;
            $scope.reportDetail = true;

            $scope.projectInfoShow = function () {
                $scope.projectInfo = !$scope.projectInfo;
            };

            $scope.reportDetailShow = function () {
                $scope.reportDetail = !$scope.reportDetail;
            };

            $scope.$on('$ionicView.loaded', function () {
                AccountService.queryDetail($stateParams.id, function (data) {
                    $scope.detail = data;
                });
                AccountService.queryReport($stateParams.id, function (data) {
                    $scope.report = data;
                });
            });

        }]);
