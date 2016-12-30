angular.module('app.frame.setting')
    .factory("SettingService",['YTService', 'UserService','$ionicPopup', function (YT, userService,$ionicPopup){
        return {
            getUserDetail:function (callback) {
                var filter = [{field:'id',value:userService.getUserId(),operator:'=',relation:'and'}];
                YT.query({
                    data:{m:1004,t:'v_org_user',filter:JSON.stringify(filter)},
                    successCallback:function (data) {
                        var login = data.object[0];
                        callback(login);
                    }
                })
            },
            upDateUser:function (data,callback) {
                var filter = [{field:'id',value:userService.getUserId(),operator:'=',relation:'and'}];
                YT.update({
                    data:{
                        m:1004,
                        t:'org_user',
                        v:JSON.stringify([{
                            t:'org_user',
                            data:data,
                            filter:filter
                        }])
                    },
                    successCallback:callback
                })
            },
            updatePassword:function (old,newPd,newPdConfirm,callback) {
                if(newPd.length<6){
                    $ionicPopup.alert({
                        template:'新密码最少6位！'
                    })
                }else if(old.length>15||newPd.length>15){
                    $ionicPopup.alert({
                        template:'密码最多15位！'
                    })
                }else if(newPd!=newPdConfirm){
                    $ionicPopup.alert({
                        template:'密码和确认密码填写不一致！'
                    })
                }else{
                    var filter = [
                        {field: 'id', value: userService.getUserId(), operator: '=', relation: ''}
                    ];
                    var userData = {
                        password: newPd
                    };
                    var data = {
                        m: 1002,
                        t: 'org_user',             //table
                        v: JSON.stringify([{
                            t: 'org_user',
                            data: userData,
                            filter: filter
                        }]),
                        params: '{"oldPd": "' +old + '"}'
                    };
                    YT.update({
                        data: data,
                        successCallback: function (data) {
                            if (200 == data.status) {
                                $ionicPopup.alert({template:'密码修改成功！'}).then(function (res) {
                                    callback();

                                });
                            } else {
                                $ionicPopup.alert({template:data.object});
                            }
                        }
                    })
                }
            },
            isTelephoneRepeated:function (telephone,id,callback) {
                var userId = 0;
                if(id){
                    userId=id;
                }
                var filter = [{field:'telephone',value:telephone,operator:'=',relation:'and'},
                    {field:'id',value:userId,operator:'<>',relation:'and'}];
                YT.query({
                    data:{
                        m:1004,
                        t:'v_org_user',
                        filter:JSON.stringify(filter)
                    },
                    successCallback:function (data) {
                        if(data.object.length>0){
                            $ionicPopup.alert({
                                template:'该号码已存在！'
                            });
                        }else{
                            callback();
                        }
                    }
                });
            }
        }
    }]);
