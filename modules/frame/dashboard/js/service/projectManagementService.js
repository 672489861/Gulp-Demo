/**
 * Created by zjw on 2016/11/2.
 */
angular.module('app.frame.dashboard')
    .factory("ProjectManagementService", ['SubscribeModuleService',
        function (subscribeModuleService) {
            return {
                getSelectedModules: function () {
                    var selectedModules = subscribeModuleService.getSelectedModules();
                    var projectModules = subscribeModuleService.getProjectModules();
                    var modules = [];
                    for (var i = 0; i < selectedModules.length; i++) {
                        for (var j = 0; j < projectModules.length; j++) {
                            if (selectedModules[i].moduleId == projectModules[j].moduleId && selectedModules[i].projects != null) {
                                modules.push(selectedModules[i]);
                                break;
                            }
                        }
                    }
                    return modules;
                }
            };
        }]);