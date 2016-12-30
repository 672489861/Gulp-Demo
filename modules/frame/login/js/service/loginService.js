angular.module('app.frame.login')
    .factory("LoginService", ['$http', 'env', 'LocalStorageService', 'UserService', 'YTService', function ($http, env, localStorageService, userService, YT) {
        return {
            //登陆验证
            loginCheck: function (username, password) {
                return $http({
                    method: 'POST',
                    url: env.server + "login",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {userName: username, password: password, platform: 2}
                });
            },

            //缓存用户信息
            cacheUserInfo: function (data) {
                // 组织机构缓存
                var rootOrgId = localStorageService.getObject("currentOrgId");
                var length = data.orgList.length;
                var hasOrg = false;

                // 查看组织机构有没有改变
                for (var i = 0; i < length; i++) {
                    if (data.orgList[i].rootOrgId == rootOrgId) {
                        hasOrg = true;
                        break;
                    }
                }
                // 保存当前组织机构到cookie,如果已经保存则不再处理
                if (!hasOrg) {
                    localStorageService.setObject("currentOrgId", data.orgList[0].rootOrgId);
                }
                //方便切换组织机构,这里保存组织机构列表
                localStorageService.setObject("orgList", data.orgList);
                //保存模块列表
                localStorageService.setObject("moduleList", data.moduleList);
            },

            cacheCurrentUserInfo: function (success) {
                var filter = [
                    {field: 'rootId', value: userService.getRootOrgId(), operator: '=', relation: ''}
                ];

                var data = {
                    m: 0,
                    t: 'v_frame_org_user',
                    filter: JSON.stringify(filter)
                };
                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (data.status == 200) {
                            localStorageService.setObject("userInfo", data.object[0]);
                            success();
                        }
                    }
                });
            }
        }
    }]);