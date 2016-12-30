/**
 * Created by zjw on 2016/9/23.
 */
angular.module('app.frame.office')
    .factory("MenuService", ['YTService', 'UserService', function (YT, userService) {
        var menuList = null;
        return {
            setMenuList: function (list) {
                menuList = list;
            },
            getMenuList: function () {
                return menuList;
            }
        };
    }]);