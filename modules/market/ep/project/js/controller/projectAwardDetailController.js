angular.module('app.market.ep.project')
    .controller('ProjectAwardDetailController', ['$scope', '$stateParams', 'ProjectService',
        function ($scope, $stateParams, projectService) {
            $scope.attachment = true;
            $scope.attachmentShow = function () {
                $scope.attachment = !$scope.attachment;
            };
            $scope.award = $stateParams.award;
            projectService.getAwardAttach($stateParams.award.awardid, function (data) {
                $scope.attaches = data;
            });

            $scope.download = function (attach) {
                projectService.downloadAttach(attach);
            }
        }]);
