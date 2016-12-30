/**
 * Created by zjw on 2016/9/9.
 */
angular.module('app.subcontract.person')
    .factory("PersonDetailService", ['YTService', 'UserService', 'env', function (YT, userService, env) {
        return {
            getPersonDetail: function (personId, successCallback) {
                var data = {
                    m: 13002001,
                    t: 'v_subcontract_person'
                };
                var filter = [{field: 'personId', value: personId, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);
                YT.query({
                    data: data,
                    successCallback: function (data) {
                        var obj = data.object[0];
                        var ticket = userService.getTicket();
                        if (obj.photourl == null || obj.photourl == "") {
                            obj.photourl = "modules/subcontract/person/img/photo.png";
                        } else {
                            obj.photourl = obj.photourl.replace("\\", "/");
                            obj.photourl = env.server + "/download.action?rnd=" + Math.random() + "&tkt=" + ticket + "&fileName=" + obj.photourl;
                        }
                        successCallback(obj);
                    }
                });
            },
            getPersonAttach: function (personId, successCallback) {
                var data = {
                    m: 13002001,
                    t: 'subcontract_person_attach'
                };
                var filter = [{field: 'id', value: personId, operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);
                YT.query({
                    data: data,
                    successCallback: function (data) {
                        var normalAttach = [], specialAttach = [];
                        for (var i = 0; i < data.object.length; i++) {
                            var obj = data.object[i];
                            if (obj.typeId == 0) {
                                normalAttach.push(obj);
                            } else {
                                specialAttach.push(obj);
                            }
                        }
                        successCallback(normalAttach, specialAttach);
                    }
                });
            },
            getPersonWorkDays: function (personId, successCallback) {
                var self = this;
                var data = {
                    m: 13002002,
                    t: 'v_subcontract_person_attendance_workdays_statistics_personal'
                };
                var filter = [
                    {field: 'personId', value: personId, operator: '=', relation: 'and'},
                    {field: 'year', value: new Date().getFullYear(), operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);
                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (data.object.length == 0) {
                            successCallback(0);
                        } else {
                            successCallback(self.getMonthData(data.object[0]));
                        }
                    }
                });
            },
            getPersonWorkHours: function (personId, successCallback) {
                var self = this;
                var data = {
                    m: 13002002,
                    t: 'v_subcontract_person_attendance_workhours_statistics_personal'
                };
                var filter = [
                    {field: 'personId', value: personId, operator: '=', relation: 'and'},
                    {field: 'year', value: new Date().getFullYear(), operator: '=', relation: 'and'}];
                data.filter = JSON.stringify(filter);
                YT.query({
                    data: data,
                    successCallback: function (data) {
                        if (data.object.length == 0) {
                            successCallback(0);
                        } else {
                            successCallback(self.getMonthData(data.object[0]));
                        }
                    }
                });
            },
            getMonthData: function (data) {
                var month = new Date().getMonth() + 1;
                switch (month) {
                    case 1:
                        return data.Jan;
                        break;
                    case 2:
                        return data.Feb;
                        break;
                    case 3:
                        return data.Mar;
                        break;
                    case 4:
                        return data.Apr;
                        break;
                    case 5:
                        return data.May;
                        break;
                    case 6:
                        return data.Jun;
                        break;
                    case 7:
                        return data.Jul;
                        break;
                    case 8:
                        return data.Aug;
                        break;
                    case 9:
                        return data.Sept;
                        break;
                    case 10:
                        return data.Oct;
                        break;
                    case 11:
                        return data.Nov;
                        break;
                    default:
                        return data.Dec;
                        break;
                }
            }
        };
    }]);