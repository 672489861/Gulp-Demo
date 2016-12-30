angular.module('app.safety.safetyData')
    .controller('SafetyDataDetailController', ['$scope', '$ionicHistory', 'SafetyDataService', '$state', '$stateParams',
        function ($scope, $ionicHistory, safetyDataService, $state, $stateParams) {
            $scope.safetyData = $stateParams.data;
            $scope.download=function (attach) {
                safetyDataService.downloadAttach({url:attach.filePath,name:attach.fileName});
            }
        }]);
