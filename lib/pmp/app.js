var app = angular.module('app', [
    'ionic',
    'app.frame',
    'app.contract',
    'onezone-datepicker',
    'app.merchant',
    'app.device',
    'app.subcontract',
    'app.merchant',
    'app.device',
    'app.market',
    'app.safety',
    'app.quality',
    'ngCordova'
]);


app.run(function ($ionicPlatform, $http, $httpParamSerializerJQLike, $rootScope, $state, $ionicPopup,
                  $location, $ionicHistory, $cordovaToast) {
    $ionicPlatform.ready(function () {
        if (window.StatusBar) {
            StatusBar.styleLightContent();
        }
        //监听键盘事件,隐藏tab
        window.addEventListener('native.keyboardshow', function () {
            document.querySelector('div.tabs').style.display = 'none';
            angular.element(document.querySelector('ion-content.has-tabs')).css('bottom', 0);
        });
        //监听键盘事件,显示tab
        window.addEventListener('native.keyboardhide', function () {
            var tabs = document.querySelectorAll('div.tabs');
            angular.element(tabs[0]).css('display', '');
        });
    });

    $ionicPlatform.registerBackButtonAction(function (e) {
        e.preventDefault();
        function exit() {
            $rootScope.backButtonPressedOnceToExit = true;
            $cordovaToast.showShortTop('再按一次退出程序');
            setTimeout(function () {
                $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
        }

        if ($location.path() == '/tabs/office' || $location.path() == '/login') {
            if ($rootScope.backButtonPressedOnceToExit) {
                JPushTool.stop();
                ionic.Platform.exitApp();
            } else {
                exit();
            }
        } else if ($ionicHistory.backView() && $location.path() != '/tabs/office') {
            $ionicHistory.goBack();
        } else {
            exit();
        }
        return false;
    }, 101);

    $http.defaults.transformRequest.unshift($httpParamSerializerJQLike);

    $rootScope.openPushMessage = function (dataId, module) {
        if (module == "safety") {
            $state.go("safety/dailyCheck/dailyCheck-detail", {id: dataId});
        } else if (module == "quality") {
            $state.go("quality/check/quality-detail", {id: dataId});
        } else {
            $state.go("tabs.dashboard");
        }
    };

    // 下载需要
    document.addEventListener("offline", function () {
        $rootScope.networkState = navigator.connection.type;
    }, false);
    document.addEventListener("online", function () {
        $rootScope.networkState = navigator.connection.type;
    }, false);
});


app.config(function ($ionicConfigProvider) {
    //配置tabs的位置和样式
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.tabs.style("standard ");

    //禁止侧滑后退事件
    $ionicConfigProvider.views.swipeBackEnabled(false);

    /*ionic.Platform.isFullScreen = true;*/
});