var JPushTool = (function () {
    var JPush = {};
    JPush.__config = {};
    JPush.EVENTS = {
        //点击notification时候触发。
        "jpush.openNotification": function (event) {
            try {
                var openNotification = {
                    alertContent: "",
                    title: "",
                    extras: {}
                };
                if (device.platform == 'Android') {
                    openNotification.alertContent = window.plugins.jPushPlugin.openNotification.alert;
                    openNotification.title = window.plugins.jPushPlugin.openNotification.title;
                    openNotification.extras = window.plugins.jPushPlugin.openNotification.extras;
                } else {
                    openNotification.alertContent = event.aps.alert;
                    openNotification.title = "";
                    openNotification.extras = event;
                }
                JPush._get('openNotification')(openNotification);
            } catch (exception) {
                alert(exception);
            }
        }
    };

    JPush.init = function (config) {
        JPush.__config = config;
        //初始化Jpush
        window.plugins.jPushPlugin.init();
        //初始化 别名 和标签
        var alias = JPush._get("alias") || "";
        JPush.setAlias(alias + "");
        JPush._bindEvent();
        return JPush;
    };

    JPush.setTagsWithAlias = function (tags, alias) {
        window.plugins.jPushPlugin.setTagsWithAlias(tags, alias);
        return JPush;
    };

    JPush.setAlias = function (alias) {
        window.plugins.jPushPlugin.setAlias(alias);
        return JPush;
    };

    JPush.setTags = function (tags) {
        window.plugins.jPushPlugin.setTags(tags);
        return JPush;
    };

    JPush.stop = function () {
        if (window.plugins != undefined) {
            window.plugins.jPushPlugin.stopPush();
        }
    };

    JPush.resumePush = function () {
        window.plugins.jPushPlugin.resumePush();
    };

    JPush.isPushStopped = function (callback) {
        window.plugins.jPushPlugin.isPushStopped(callback);
    };

    JPush._get = function (key) {
        return JPush.__config[key];
    };

    JPush._bindEvent = function () {
        var events = JPush.EVENTS;
        var type;
        for (type in events) {
            document.addEventListener(type, events[type], false);
        }
    };

    JPush._isPushStoppedCallback = function (data) {
        if (data > 0) {
            return false;
        } else {
            return true;
        }
    };

    return JPush;

})();
