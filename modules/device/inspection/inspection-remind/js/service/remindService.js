angular.module('app.device.inspection.inspection-remind')
    .factory("RemindService", ['YTService', 'UserService', '$filter', '$ionicPopup','$ionicActionSheet',
        function (YT, userService, $filter, $ionicPopup,$ionicActionSheet) {
            var remindList = [],
                pageIndex = 0,
                pageSize = 10,
                hasNextPage = true,
                imgList = [],
                condition = {
                    inspectionTime: null,
                    unit: '',
                    cost: '',
                    conclusionId: 0
                };
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
                getRemindText: function (next, typeId) {
                    var nextTime = new Date(next);
                    var sec = nextTime.getTime() - new Date().getTime();
                    var days = parseInt(sec / (1000 * 60 * 60 * 24))+1;
                    var type = typeId == 1 ? '检验' : '维保';
                    var text = '';
                    if (days > 0) {
                        text = '距下次' + type + '还有' + days + '天';
                    } else if (days < 0) {
                        text = '已过期' + type + '' + (-days) + '天';
                    } else {
                        text = '请' + type + '设备';
                    }
                    return text;
                },
                loadListDataCallback: function (data) {
                    var pageInfo = data.object;
                    for (var i = 0; i < pageInfo.items.length; i++) {
                        pageInfo.items[i].remindText = this.getRemindText(pageInfo.items[i].nextInspectionTime, 1);
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
                        m: 12003001002,
                        t: 'v_device_inspection_remind',
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
                    var date = $filter('date')(new Date(now.getTime() + 7 * 24 * 3600 * 1000), 'yyyy-MM-dd');
                    filter.push(
                        {field: 'nextInspectionTime', value: date, operator: '<=', relation: 'AND'}
                    );
                    return filter;
                },
                getDeviceRemindDetail: function (id, successCallback) {
                    var self  =this;
                    var data = {
                        m: 12003001002,
                        t: 'v_device_inspection_remind'
                    };
                    var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                    data.filter = JSON.stringify(filter);

                    YT.query({
                        data: data,
                        successCallback: function (data) {
                            data.object[0].remindText = self.getRemindText(data.object[0].nextInspectionTime,1);
                            successCallback.call(this, data.object[0]);
                        }
                    });
                },
                getDate: function (checkIntervalunit, checkInterval, intime) {
                    var date = new Date(intime);
                    if (checkInterval > 0) {
                        if (checkIntervalunit == 0) {
                            date.setYear(date.getFullYear() + parseInt(checkInterval));
                            date.setMonth(date.getMonth() + 1);
                            return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
                        } else if (checkIntervalunit == 1) {
                            var oldDays = date.getDate();
                            date.setMonth(date.getMonth() + 1 + parseInt(checkInterval));
                            var newDays = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
                            if (oldDays > newDays) {
                                date.setDate(newDays);
                            }
                            return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
                        } else if (checkIntervalunit == 2) {
                            date.setDate(date.getDate() + parseInt(checkInterval));
                            date.setMonth(date.getMonth() + 1);
                            return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
                        } else {
                            return null;
                        }
                    } else {
                        return null
                    }
                },
                /*设备检验*/
                deviceRemind: function (id, deviceRemindInfo, callback) {
                    var self = this;
                    var check = deviceRemindInfo.checkInterval;
                    var checkUnit = deviceRemindInfo.checkIntervalunit;
                    if (condition.inspectionTime == null) {
                        $ionicPopup.alert({
                            template: '检验时间必须填写！'
                        });
                        return;
                    }
                    if (condition.unit == '') {
                        $ionicPopup.alert({
                            template: '检验单位必须填写！'
                        });
                        return;
                    }
                    if (condition.cost == '') {
                        $ionicPopup.alert({
                            template: '检验费用必须填写！'
                        });
                        return;
                    }
                    if (!(condition.conclusionId > 0)) {
                        $ionicPopup.alert({
                            template: '检验结论必须填写！'
                        });
                        return;
                    }
                    if (imgList.length < 3) {
                        $ionicPopup.alert({
                            template: '附件必须上传！'
                        });
                        return;
                    }
                    if (!YT.validateAttachs(imgList)) {
                        return;
                    }
                    var nextInspectionTime = self.getDate(checkUnit, check, condition.inspectionTime);
                    var inspectionData = {
                        inspectionId: deviceRemindInfo.inspectionId,
                        inspectionTime: condition.inspectionTime,
                        lastInspectionTime: condition.inspectionTime,
                        cost: condition.cost,
                        unit: condition.unit,
                        conclusionId: condition.conclusionId,
                        nextInspectionTime: nextInspectionTime
                    };
                    var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                    var slave = [];
                    for (var i = 0; i < imgList.length; i++) {
                        slave.push({
                            key: 'inspectionId:id',
                            t: 'device_inspection_attach',
                            data: {
                                url: imgList[i].data.url,
                                name: imgList[i].data.name,
                                typeId: imgList[i].typeId,
                                id: deviceRemindInfo.inspectionId
                            }
                        })
                    }
                    var data = {
                        m: 12003001002,
                        t: 'device_inspection',
                        v: JSON.stringify([{
                            t: 'device_inspection',
                            data: inspectionData,
                            filter: filter,
                            slave: slave
                        }])
                    };
                    YT.update({
                        data: data,
                        successCallback: function (data) {
                            if (data.status == 200) {
                                $ionicPopup.alert({
                                    template: '检验设备成功！'
                                });
                                self.resetCondition();
                                if (callback) {
                                    callback();
                                }
                            } else {
                                $ionicPopup.alert({
                                    template: '检验设备失败！'
                                });
                            }
                        }
                    })
                },
                getConclusion: function (callback) {
                    YT.query({
                        data: {m: 12003001002, t: 'device_d_inspectionconclusion'},
                        successCallback: function (data) {
                            callback(data.object);
                        }
                    })
                },
                resetCondition: function () {
                    imgList = [];
                    condition = {
                        inspectionTime: null,
                        unit: '',
                        cost: '',
                        conclusionId: 0
                    };
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