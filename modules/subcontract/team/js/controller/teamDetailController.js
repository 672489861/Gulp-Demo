/**
 * Created by zjw on 2016/9/8.
 */
angular.module('app.subcontract.team')
    .controller('TeamDetailController', ['$scope', '$state', '$stateParams', 'TeamDetailService',
        function ($scope, $state, $stateParams, teamDetailService) {

            $scope.$on('$ionicView.loaded', function () {
                teamDetailService.getTeamDetail($stateParams.id, function (data) {
                    $scope.teamDetail = data;
                });
                teamDetailService.getTeamWorkContentDetail($stateParams.id, function (data) {
                    $scope.teamWorkContentDetail = data;
                });
            });

        }
    ]);