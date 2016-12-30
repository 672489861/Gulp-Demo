angular.module('app.device',[
    'app.device.information',
    'app.device.inspection.inspection-remind',
    'app.device.inspection.inspection-record',
    'app.device.maintain.maintain-remind',
    'app.device.maintain.maintain-record'
])
    .filter("showAttachType", function () {
    return function (fileName) {
        var url = '';
        switch (fileName) {
            case 0:
                url = "检验证书";
                break;
            case 1:
                url = "合格证书";
                break;
            case 2:
                url = "使用证书";
                break;
        }
        return url;
    }
})
;