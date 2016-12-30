var YTM = YTM || {};
YTM.initDatePicker = function (opts) {
    var defaultOpts = {
        date: new Date(),
        callback: null
    };
    opts = angular.merge(defaultOpts, opts);
    return {
        date: opts.date,
        mondayFirst: false,
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        daysOfTheWeek: ["日", "一", "二", "三", "四", "五", "六"],
        startDate: new Date(1989, 1, 26),
        endDate: new Date(2024, 1, 26),
        disablePastDays: false,
        disableSwipe: false,
        disableWeekend: false,
        disableDates: '',
        showDatepicker: false,
        showTodayButton: false,
        calendarMode: false,
        hideCancelButton: true,
        hideSetButton: true,
        callback: opts.callback
    };
};

YTM.tool={
    money: {
        numberToChineseCurrency: function (amount) {
            amount = parseFloat(amount);
            if (isNaN(amount)) {
                return;
            }// || Math.abs(amount) > 99999999999.99
            amount = Math.round(amount * 100);
            var isInt = amount % 100 == 0 ? true : false;
            var numArr = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
            var unitArr = ["分", "角", "元", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰", "仟"];
            var resultStr = '', num, unitIdx, len, zeroCount = 0;
            if (amount == 0) {
                return '零元整';
            }
            if (amount < 0) {
                resultStr += '负';
                amount = -amount;
            }
            amount = amount.toString();
            len = amount.length;
            for (var i = 0; i < len; i++) {
                num = parseInt(amount.charAt(i));
                unitIdx = len - 1 - i;
                if (num == 0) {
                    //元 万 亿 输出单位
                    if (unitIdx == 2 || unitIdx == 6 || unitIdx == 11) {
                        resultStr += unitArr[unitIdx];
                        zeroCount = 0;
                    } else {
                        zeroCount++;
                    }
                } else {
                    if (zeroCount > 0) {
                        resultStr += '零';
                        zeroCount = 0;
                    }
                    resultStr = resultStr + numArr[num] + unitArr[unitIdx];
                }
            }
            if (isInt) {
                resultStr += '整';
            }
            return resultStr;
        }
    }
};
