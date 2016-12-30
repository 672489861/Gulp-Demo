angular.module('app.quality.check')
    .controller('qualityCheckDraftsListController',
        ['$scope','$state','LocalStorageService','$ionicViewSwitcher',
        function ($scope, $state,LocalStorageService,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.qualityCheckList= JSON.parse(LocalStorageService.get('qualityCheckList'));
            });

            $scope.toEdit = function(id){
                $state.go('quality/check/quality-drafts-edit',{id:id});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.back=function(){
                $state.go('quality/check/quality-list');
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
