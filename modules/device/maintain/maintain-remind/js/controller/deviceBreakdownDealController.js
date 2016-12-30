angular.module('app.device.maintain.maintain-remind')
    .controller('DeviceBreakdownDealController',['$scope','$state','$stateParams','$ionicHistory','$ionicModal','$ionicScrollDelegate','MaintainRemindService',
        function($scope,$state,$stateParams,$ionicHistory,$ionicModal,$ionicScrollDelegate,addRemindService){


            $scope.condition = addRemindService.getCondition();
            $ionicModal.fromTemplateUrl('breakdown-deal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modalBreakdownDeal = modal;
            });

            $scope.openBreakdownDeal = function () {
                $scope.modalBreakdownDeal.show();
            };

            $scope.hideBreakdownDeal = function () {
                $scope.modalBreakdownDeal.hide();

            };
            $scope.addBreakdownDeal = function () {
                addRemindService.addBreakdownDeal(function () {
                    $scope.hideBreakdownDeal();
                    addRemindService.getBreakdownDeal(function(data){
                        $scope.breakdownDeal = data;
                    });
                });
            };

            $scope.onItemDelete = function(item) {
                $scope.items.splice($scope.items.indexOf(item), 1);
            };
            //加载提供单位列表
            addRemindService.getBreakdownDeal(function(data){
                $scope.breakdownDeal = data;
            });
            
            $scope.chooseBreakDown=function (item) {
                if(item.name.length<15){
                    $scope.condition.breakdownName = item.name;
                }else{
                    var name = item.name = item.name.substring(0,15);
                    name+='...';
                    $scope.condition.breakdownName = name;
                }
                $state.go('device/maintain/maintain-remind/maintain-device-detail',{id:$stateParams.id});
            }

        }]);
