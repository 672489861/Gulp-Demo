angular.module('app.market', [
    'app.market.ep'
]).filter("prjAttachType", function () {
        return function (fileName) {
            var url = "";
            switch (fileName) {
                case 1:
                    url = "中标通知书";
                    break;
                case 2:
                    url = "承包合同";
                    break;
                case 3:
                    url = "施工许可证";
                    break;
                case 4:
                    url = "竣工验收证明";
                    break;
                case 5:
                    url = "项目矢量效果图";
                    break;
                case 6:
                    url = "工程实景图";
                    break;
            }
            return url;
        }
    })
    .filter("sexFilter", function () {
        return function (sex) {
            var url = '不限';
            if (sex == 0) {
                url = '男';
            }
            if (sex == 1) {
                url = '女';
            }
            return url;
        }
    })
    .filter("insureFilter", function () {
        return function (sex) {
            var url = '不限';
            if (sex == 0) {
                url = '未参保';
            }
            if (sex == 1) {
                url = '已参保';
            }
            return url;
        }
    })
;