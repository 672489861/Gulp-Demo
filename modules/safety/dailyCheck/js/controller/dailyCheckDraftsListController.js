angular.module('app.safety.dailyCheck')
    .controller('dailyCheckDraftsListController',['$scope','$state','LocalStorageService','$ionicViewSwitcher',
        function ($scope, $state,LocalStorageService,$ionicViewSwitcher) {

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.dailyCheckList= JSON.parse(LocalStorageService.get('dailyCheckList'));
            });

            $scope.toEdit = function(id){
                $state.go('safety/dailyCheck/dailyCheck-drafts-edit',{id:id});
                $ionicViewSwitcher.nextDirection("forward");
            };

            $scope.back=function(){
                $state.go('safety/dailyCheck/dailyCheck-list');
                $ionicViewSwitcher.nextDirection("back");
            };
        }]);
