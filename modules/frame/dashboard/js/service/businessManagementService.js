/**
 * Created by zjw on 2016/11/2.
 */
angular.module('app.frame.dashboard')
    .factory("BusinessManagementService", ['SubscribeModuleService',
        function (subscribeModuleService) {
            return {
                getSelectedModules: function () {
                    var selectedModules = subscribeModuleService.getSelectedModules();
                    var businessModules = subscribeModuleService.getBusinessModules();
                    var modules = [];
                    for (var i = 0; i < selectedModules.length; i++) {
                        for (var j = 0; j < businessModules.length; j++) {
                            if (selectedModules[i].moduleId == businessModules[j].moduleId && selectedModules[i].projects == null) {
                                modules.push(selectedModules[i]);
                                break;
                            }
                        }
                    }
                    return modules;
                }
            }
        }]);