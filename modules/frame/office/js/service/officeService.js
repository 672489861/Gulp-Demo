angular.module('app.frame.login')
    .factory("OfficeService", ['YTService', 'UserService', 'LocalStorageService', function (YT, userService, localStorageService) {
        var menuTree = null, orgName = null;
        return {
            getMenuList: function (success, change) {
                if (menuTree == null || change == true) {
                    var filter = [
                        {field: 'rootOrgId', value: userService.getRootOrgId(), operator: '=', relation: ''}
                    ];

                    var data = {m: 0, t: 'v_frame_menu_mobile', filter: JSON.stringify(filter)};

                    YT.query({
                        data: data,
                        successCallback: function (data) {
                            menuTree = new YTM.Util.Tree({
                                data: data.object,
                                sortField: 'dispOrder'
                            });

                            return success(menuTree);
                        }
                    });
                } else {
                    return success(menuTree);
                }
            },
            getRootOrgName: function () {
                if (orgName == null) {
                    return userService.getRootOrgName();
                } else {
                    return orgName
                }
            },
            setOrgName: function (name) {
                orgName = name;
            },
            clearAll: function () {
                menuTree = null;
                orgName = null;
            }
        };
    }]);
