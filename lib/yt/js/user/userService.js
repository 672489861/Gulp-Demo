angular.module('app.service', ['com.yt.mui'])
    .factory("UserService", ['LocalStorageService', function (localStorageService) {
        return {
            getUserInfo: function () {
                return localStorageService.getObject("userInfo")
            },

            getRootOrgId: function () {
                return localStorageService.getObject("currentOrgId");
            },

            getRootOrgName: function () {
                return this.getUserInfo().rootName;
            },

            getUserId: function () {
                return this.getUserInfo().userId;
            },

            getUserName: function () {
                return this.getUserInfo().userName;
            },

            getTypeId: function () {
                return this.getUserInfo().type;
            },

            getTicket: function () {
                return localStorageService.getObject("tkt");
            },

            getOrgList: function () {
                return localStorageService.getObject("orgList");
            }
        }
    }]);