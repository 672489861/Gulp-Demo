angular.module('app.frame.office')
    .controller('MenuController', ['$scope', '$state', '$stateParams', 'MenuService',  'PrimaryService',
        function ($scope, $state, $stateParams, menuService, primaryService) {

            if ($stateParams.menuList != null) {
                menuService.setMenuList($stateParams.menuList);
            }
            $scope.menu = menuService.getMenuList();

            // 项目部登陆直接跳总承包详细
            $scope.goContractDetail = function () {
                primaryService.goContractDetail();
            };

            $scope.goBack = function () {
                $state.go('tabs.office');
            };

        }]);