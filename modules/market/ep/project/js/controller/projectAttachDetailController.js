angular.module('app.market.ep.project')
    .controller('ProjectAttachDetailController', ['$scope', '$stateParams', 'ProjectService', function ($scope, $stateParams, projectService) {
        $scope.attachment = true;
        $scope.attachmentShow = function () {
            $scope.attachment = !$scope.attachment;
        };
        $scope.attaches = $stateParams.attaches;

        $scope.download = function (attach) {
            projectService.downloadAttach(attach);
        }
    }]);
