angular.module('app.safety.safetyData')
    .factory('SafetyDataService', ['YTService', 'UserService', function (YT, userService) {
        return{
            listToTree: function (data, pid) {
                var result = [], temp, self = this;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].pid == pid) {
                        var obj = data[i];
                        temp = self.listToTree(data, data[i].id);
                        if (temp.length > 0) {
                            obj.subs = temp;
                        } else {
                            obj.subs = [];
                        }
                        result.push(obj);
                    }
                }
                return result;
            },
            getTreeData:function (callback) {
                var self =this;
                YT.query({
                    data:{
                        m:15003,
                        t:'v_safety_d_filegroup',
                        order:'id',
                        filter:JSON.stringify([{field:'orgId',value:userService.getRootOrgId(),operator:'=',relation:'or'},
                            {field:'orgId',value:'null',operator:'is',relation:'or'}])
                    },
                    successCallback:function (data) {
                        var tree=[];
                        for(var i=0;i<data.object.length;i++){
                            if(data.object[i].pid==0){
                                data.object[i].subs = self.listToTree(data.object,data.object[i].id);
                                tree.push(data.object[i]);
                            }
                        }
                        callback(tree);
                    }
                })
            },
            getSafetyDataDetail:function (groupId,callback) {
                var filter = [{field:'groupId',value:groupId,operator:'=',relation:'and'},
                    {field:'orgId',value:userService.getRootOrgId(),operator:'=',relation:'and'}];
                YT.query({
                    data:{
                        m:15003,
                        t:'v_safety_safetydata',
                        order:'uploadTime desc',
                        filter:JSON.stringify(filter)
                    },
                    successCallback:function (data) {
                        var order=[];
                        for(var i=0;i<data.object.length;i++){
                            if(i==0){
                                order.push([data.object[i]])
                            }else{
                                if(data.object[i].uploadTime!=data.object[i-1].uploadTime){
                                    order.push([data.object[i]]);
                                }else{
                                    order[order.length-1].push(data.object[i]);
                                }
                            }
                        }
                        callback(order);
                    }
                });
            },
            downloadAttach:function (attach) {
                YT.download(attach);
            }
        }
    }])
;