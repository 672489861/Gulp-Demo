angular.module('app.market.ep.project')
    .controller('ProjectPunishDetailController', ['$scope', '$stateParams', 'ProjectService',
        function ($scope, $stateParams, projectService) {
            $scope.attachment = true;
            $scope.attachmentShow = function () {
                $scope.attachment = !$scope.attachment;
            };
            $scope.punish = $stateParams.punish;
            projectService.getPunishAttach($stateParams.punish.punishid, function (data) {
                $scope.attaches = data;
            });

            $scope.download = function (attach) {
                projectService.downloadAttach(attach);
            }
        }]);
