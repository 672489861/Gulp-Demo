angular.module('app.quality.check')
    .controller('qualityCheckDetailController', ['$scope', '$state', '$stateParams', 'qualityCheckService', '$ionicViewSwitcher',
        function ($scope, $state, $stateParams, qualityCheckService,$ionicViewSwitcher) {
            $scope.$on('$ionicView.loaded', function () {
                qualityCheckService.queryDetail($stateParams.id,function (data) {
                    $scope.detailInfo = data;
                });
                qualityCheckService.queryDetailProblem($stateParams.id, function () {
                    $scope.contentList = qualityCheckService.getContent();
                });
                qualityCheckService.queryDetailCheckAttach($stateParams.id, function (data) {
                    $scope.checkAttach = data;
                    qualityCheckService.changeAttach($scope.checkAttach);
                });
                qualityCheckService.queryDetailRecheckAttach($stateParams.id, function (data) {
                    $scope.recheckAttach = data;
                    qualityCheckService.changeAttach($scope.recheckAttach);
                });
                $scope.backUrl = $stateParams.backUrl || "quality/check/quality-list";
            });
            $scope.back=function(){
                $state.go($scope.backUrl);
                $ionicViewSwitcher.nextDirection("back");
            };

            $scope.preview = function(imgIndex, arr){
                qualityCheckService.preview(imgIndex, arr);
            }
        }]);