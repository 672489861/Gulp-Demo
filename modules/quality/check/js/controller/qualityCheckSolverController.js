angular.module('app.quality.check')
    .controller('qualityCheckSolverController', ['$scope', '$state', '$stateParams','$ionicPopup', 'qualityCheckAddService','$ionicViewSwitcher',
        function ($scope, $state, $stateParams, $ionicPopup,qualityCheckAddService,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                if ($stateParams.backUrl) {
                    $scope.backUrl = $stateParams.backUrl;
                }
                qualityCheckAddService.querySolver(function(data){
                    $scope.solver = data;
                });
                $scope.solverId = qualityCheckAddService.getCheckData().solverId;
            });
            $scope.chooseSolver = function (obj) {
                qualityCheckAddService.setSolverId(obj.userId);
                qualityCheckAddService.setSolverName(obj.realName);
                $state.go($scope.backUrl,{backUrl:'quality/check/quality-list'});
                $ionicViewSwitcher.nextDirection("back");
            };
            $scope.back = function () {
                $state.go($scope.backUrl,{backUrl:'quality/check/quality-list'});
                $ionicViewSwitcher.nextDirection("back");
            };

        }]);