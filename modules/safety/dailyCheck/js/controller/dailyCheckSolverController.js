angular.module('app.safety.dailyCheck')
    .controller('dailyCheckSolverController', ['$scope', '$state', '$stateParams','$ionicPopup', 'dailyCheckAddService','$ionicViewSwitcher',
        function ($scope, $state, $stateParams, $ionicPopup,dailyCheckAddService,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if ($stateParams.backUrl) {
                    $scope.backUrl = $stateParams.backUrl;
                }
                dailyCheckAddService.querySolver(function(data){
                    $scope.solver = data;
                });
                $scope.solverId = dailyCheckAddService.getCheckData().solverId;
            });
            $scope.chooseSolver = function (obj) {
                dailyCheckAddService.setSolverId(obj.userId);
                dailyCheckAddService.setSolverName(obj.realName);
                $state.go($scope.backUrl,{backUrl:'safety/dailyCheck/dailyCheck-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'safety/dailyCheck/dailyCheck-list'});
                $ionicViewSwitcher.nextDirection("back");
            };

        }]);