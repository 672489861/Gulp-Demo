angular.module('app.device.maintain.maintain-remind')
    .factory("MaintainRemindService", ['YTService', 'UserService', 'RemindService', '$ionicPopup', '$filter','$ionicActionSheet',
        function (YT, userService, remindService, $ionicPopup, $filter,$ionicActionSheet) {
            var remindList = [],
                imgList=[],
                pageIndex = 0,
                pageSize = 10,
                hasNextPage = true,
                condition = {};
            return {
                loadListData: function (successCallback) {
                    ++pageIndex;
                    var self = this;
                    YT.query({
                        data: self.getSearchData(),
                        successCallback: function (data) {
                            self.loadListDataCallback(data);
                            //successCallback();
                            successCallback.call();
                        }
                    });
                },

                loadListDataCallback: function (data) {
                    var pageInfo = data.object;
                    for (var i = 0; i < pageInfo.items.length; i++) {
                        pageInfo.items[i].remindText = remindService.getRemindText(pageInfo.items[i].nextmaintainTime, 2);
                        remindList.push(pageInfo.items[i]);
                    }
                    //pageInfo.pageCount确定页数
                    if (pageIndex >= pageInfo.pageCount) {
                        hasNextPage = false;
                    } else {
                        hasNextPage = true;
                    }
                },
                //刷新
                refreshListData: function (successCallBack) {
                    this.clearCachedData();
                    this.loadListData(successCallBack);
                },

                clearCachedData: function () {
                    pageIndex = 0;
                    hasNextPage = true;
                    remindList = [];
                },

                getSearchData: function () {
                    var data = {
                        m: 12003002002,
                        t: 'v_device_maintain_remind',
                        page: pageIndex,
                        rows: pageSize
                    };

                    var filter = this.getSearchFilter();
                    data.filter = JSON.stringify(filter);
                    return data;
                },

                getSearchFilter: function () {
                    var filter = [{field: 'orgId', value: userService.getRootOrgId(), operator: '=', relation: 'AND'}];
                    var now = new Date();
                    var date = $filter('date')(new Date(now.getTime() + 5 * 24 * 3600 * 1000), 'yyyy-MM-dd');
                    filter.push(
                        {field: 'nextmaintainTime', value: date, operator: '<=', relation: 'AND'}
                    );
                    return filter;
                },
                //错误分析
                getBreakdownDeal: function (callback) {
                    YT.query({
                        data: {
                            m: 12003002002,
                            t: 'v_device_breakdown',
                            filter: JSON.stringify([
                                {field: 'orgId', value: userService.getRootOrgId(), operator: '=', relation: 'AND'}
                            ])
                        },
                        successCallback: function (data) {
                            callback(data.object);
                        }
                    });
                },
                addBreakdownDeal: function (callback) {
                    var data = {name: condition.name, orgId: userService.getRootOrgId()};
                    var v = {t: 'device_d_breakdown', data: data, ai: true};
                    YT.query({
                        data: {
                            m: 12003002002,
                            t: 'device_d_breakdown',
                            filter: JSON.stringify([{field: 'name', value: data.name, operator: '=', relation: 'and'}])
                        },
                        successCallback: function (result) {
                            if (result.object.length == 0) {
                                YT.insert({
                                    data: {
                                        m: 12003002002,
                                        t: 'device_d_breakdown',
                                        v: JSON.stringify([v])
                                    }, successCallback: function (data) {
                                        if (data.status == 200) {
                                            callback();
                                        } else {
                                            $ionicPopup.alert({
                                                template: data.message
                                            });
                                        }
                                    }
                                });
                            } else {
                                $ionicPopup.alert({
                                    template: '该故障分析已存在！'
                                });
                            }
                        }
                    });
                },
                getDeviceRemindDetail: function (id, successCallback) {
                    var data = {
                        m: 12003002002,
                        t: 'v_device_maintain_remind'
                    };
                    var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                    data.filter = JSON.stringify(filter);

                    YT.query({
                        data: data,
                        successCallback: function (data) {
                            data.object[0].remindText=remindService.getRemindText(data.object[0].nextmaintainTime,2);
                            successCallback.call(this, data.object[0]);
                        }
                    });
                },
                getConclusion: function (callback) {
                    YT.query({
                        data: {
                            m: 12003002002,
                            t: 'device_d_maintainconclusion'
                        },
                        successCallback: function (data) {
                            callback(data.object);
                        }
                    })
                },
                deviceMaintain: function (device,callback) {
                    var check = device.maintainInterval;
                    var checkUnit = device.maintainIntervalunit;
                    if(!condition.startTime){
                        $ionicPopup.alert({
                            template:'维保时间必须填写！'
                        });
                        return;
                    }
                    if(!condition.unit){
                        $ionicPopup.alert({
                            template:'维保单位必须填写！'
                        });
                        return;
                    }
                    if(!condition.cost){
                        $ionicPopup.alert({
                            template:'维保费用必须填写！'
                        });
                        return;
                    }
                    if(!(condition.conclusionId>0)){
                        $ionicPopup.alert({
                            template:'检验结论必须填写！'
                        });
                        return;
                    }
                    if(condition.conclusionId==2&&!(condition.breakdownId>0)){
                        $ionicPopup.alert({
                            template:'设备有故障，故障分析必须填写！'
                        });
                        return;
                    }
                    var nextMaintainTime = remindService.getDate(checkUnit, check, condition.startTime);
                    var filter = [{field: 'id', value: device.id, operator: '=', relation: 'and'}];
                    var inspectionData = {
                        maintainId:device.maintainId,
                        maintainTime: condition.startTime,
                        lastmaintainTime: condition.startTime,
                        cost: condition.cost,
                        unit: condition.unit,
                        conclusionId: condition.conclusionId,
                        nextmaintainTime: nextMaintainTime,
                        breakdownId: condition.breakdownId
                    };
                    var slave = [];
                    for (var i = 0; i < imgList.length; i++) {
                        slave.push({
                            key: 'maintainId:id',
                            t: 'device_maintain_attach',
                            data: {
                                url: imgList[i].data.url,
                                name: imgList[i].data.name,
                                typeId: imgList[i].typeId,
                                id: device.maintainId
                            }
                        })
                    }
                    var data = {
                        m: 12003002002,
                        t: 'device_maintain',
                        v: JSON.stringify([{
                            t: 'device_maintain',
                            data: inspectionData,
                            filter: filter,
                            slave:slave
                        }])
                    };
                    YT.update({
                        data: data, successCallback: function (result) {
                            if(result.status==200){
                                $ionicPopup.alert({
                                    template:'维保设备成功！'
                                });
                                if(callback){
                                    callback();
                                }
                            }else{
                                $ionicPopup.alert({
                                    template:'维保设备失败！'
                                });
                            }
                        }
                    })
                },
                resetCondition: function () {
                    imgList=[];
                    condition = {};
                },
                getRemindList: function () {
                    return remindList;
                },

                hasNextPage: function () {
                    return hasNextPage;
                },
                getCondition: function () {
                    return condition;
                },
                pushImageList: function (item) {
                    for (var i = 0; i < imgList.length; i++) {
                        if (imgList[i].typeId == item.typeId) {
                            imgList.splice(i, 1);
                        }
                    }
                    imgList.push(item);
                },
                previewOrDelete: function (imgIndex,callback) {
                    var buttons = [{text: '预览'}];
                    $ionicActionSheet.show({
                        buttons: buttons,
                        destructiveText: '删除',
                        cancelText: '关闭',
                        cancel: function () {
                            return true;
                        },
                        buttonClicked: function (index) {
                            if (index == 0) {
                                PhotoViewer.show(imgList[imgIndex].src);
                            }
                            return true;
                        },
                        destructiveButtonClicked: function () {
                            imgList.splice(imgIndex,1);
                            callback();
                            return true;
                        }
                    });
                }
            };
        }]);