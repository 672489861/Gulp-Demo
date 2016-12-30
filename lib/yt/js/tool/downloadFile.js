/**
 * Created by ScottChan on 2016/5/19.
 *

 使用前提：

 1、初始化需要提供的参数
 downloadTool.init({
      attachList : attachList, （必须） //需要初始化的file数组，file需要存在 name 、url 属性。
      server:server,（必须）
      injector:$injector,（必须）
      open:true/false, （非必须） //下载完成后是否自动打开,默认为false.
      joinQueue :function （非必须） //加入队列时的回调
      startDownload:function, （非必须） //正在下载的回调
      success:function, （非必须） //下载成功的回调
      fail:function （非必须） //下载失败的回调
  });

 2、下载
 downloadTool.download(item);

 *
 */

var fileMIMEType = {
    txt: "text/plain",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    pdf: "application/pdf",
    rar: "application/x-rar-compressed",
    zip: "application/zip",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    bmp: "image/bmp"
};

var downloadTool = (function () {

    var downloader = {};
    var downloadUrl = "/download.action";

    //临时变量
    var itemTemp;
    var downloadingFile;
    var downloadList = [];
    var downloadingList = [];
    var service = {};
    var ignoreNetType = false;

    downloader.init = function (config) {
        downloader.__config = config;
        service = {
            $rootScope: config.injector.get("$rootScope"),
            $cordovaToast: config.injector.get("$cordovaToast"),
            $ionicPopup: config.injector.get("$ionicPopup"),
            $window: config.injector.get("$window"),
            storageService: config.storageService
        };
        downloader._showState(config.attachList, config);
    };

    //下载方法，传入item
    downloader.download = function (item) {
        //如果是 打开/添加 下载项
        if (item) {
            var file = item.url;
            var name = item.name;
            var __localUrl = item.__localUrl;
            //打开下载项
            if (__localUrl != "") {
                var suffix = __localUrl.substring(__localUrl.lastIndexOf(".") + 1, __localUrl.length);

                if (fileMIMEType.hasOwnProperty(suffix)) {
                    cordova.plugins.fileOpener2.open(__localUrl, fileMIMEType[suffix]);
                } else {
                    service.$cordovaToast.showShortCenter("文件格式不支持！");
                }
                return false;
            } else {
                //添加下载项
                var noExist = true;
                for (var i = 0; i < downloadList.length; i++) {
                    if (downloadList[i] === item) {
                        noExist = false;
                    }
                }
                for (var j = 0; j < downloadingList.length; j++) {
                    if (downloadingList[j] === item) {
                        noExist = false;
                    }
                }

                //当前在下载队列中不存在添加的项
                if (noExist) {
                    downloadList.push(item);
                    item.__downloadState = "已加入下载队列，请等待";
                }

                //回调--已加入下载队列
                if (item.__joinQueue && item.__joinQueue instanceof Function) {
                    item.__joinQueue(item);
                }

                //downloader.__config.scope.$apply();
            }
        }

        //如果没有正在下载的任务
        if (downloadingList.length == 0) {
            if (downloadList.length > 0) {
                itemTemp = downloadList.shift();
            } else {
                //重置是否忽略网络状态
                ignoreNetType = false;
                return;
            }
        } else {
            return;
        }

        //判断当前网络状态
        var netType = downloader.getNetType();
        if (!ignoreNetType) {
            if (netType == "无网络连接") {
                service.$cordovaToast.showShortCenter("无网络连接！");
            } else if (netType != "WIFI" && netType != "以太网") {
                service.$ionicPopup.confirm({
                    title: '<strong>继续下载？</strong>',
                    template: '当前处在' + netType + "网络，继续下载将可能产生流量，是否继续？",
                    okText: '下载',
                    cancelText: '取消'
                }).then(function (res) {
                    if (res) {
                        //忽视网络状态
                        ignoreNetType = true;

                        downloadingFile = file;
                        itemTemp.__downloadState = "正在下载";
                        //downloader.__config.scope.$apply();

                        downloadingList.push(itemTemp);
                        //回调-开始下载
                        if (itemTemp.__startDownload && itemTemp.__startDownload instanceof Function) {
                            itemTemp.__startDownload(itemTemp);
                            //加入正在下载列表
                        }

                        downloader._download(file, name);
                    } else {
                        itemTemp.__downloadState = '未下载';
                    }
                });
            } else {

                service.$cordovaToast.showLongTop("当前" + netType + "网络，您可以放心下载！");
                downloadingFile = file;
                itemTemp.__downloadState = "正在下载";

                downloadingList.push(itemTemp);
                //回调-开始下载
                if (itemTemp.__startDownload && itemTemp.__startDownload instanceof Function) {
                    itemTemp.__startDownload(itemTemp);
                }

                downloader._download(file, name);

            }
        } else {
            downloadingFile = file;
            itemTemp.__downloadState = "正在下载";
            //downloader.__config.scope.$apply();

            downloadingList.push(itemTemp);
            //回调-开始下载
            if (itemTemp.__startDownload && itemTemp.__startDownload instanceof Function) {
                itemTemp.__startDownload(itemTemp);
            }

            downloader._download(file, name);
        }

    };

    /**
     * 下载的方法
     */
    downloader._download = function (file, name) {
        try {
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = name;
            downloader.__ft = new FileTransfer();

            var storePath;

            if (device.platform == "Android") {
                storePath = cordova.file.externalDataDirectory;
            } else {
                storePath = cordova.file.documentsDirectory;
            }


            var fileStorePath = Date.parse(new Date()) + file.substring(file.lastIndexOf("."), file.length);
            downloader.__ft.download(encodeURI(downloader.__config.server + downloadUrl + "?rnd=" + Math.random() + "&tkt=" + downloader.__config.ticket
                + "&fileName=" + file + "&originalName=" + name), storePath + fileStorePath, downloader._success, downloader._error, false, options);


        } catch (e) {
            console.log(e);
        }
    };

    //下载成功的回调
    downloader._success = function (fileEntry) {

        //将下载失败的文件从正在下载队列中弹出
        downloadingList.pop();

        itemTemp.__downloadState = "下载成功，点击打开";
        itemTemp.__localUrl = fileEntry.toURL();
        //downloader.__config..$apply();

        var fileArr = service.storageService.get("downloadFileList");

        fileArr = fileArr || [];

        fileArr[downloadingFile] = fileEntry.toURL();
        service.storageService.set("downloadFileList", fileArr);

        downloader.download();

        if (itemTemp.__open) {
            var __localUrl = fileEntry.toURL();
            var suffix = __localUrl.substring(__localUrl.lastIndexOf(".") + 1, __localUrl.length);

            if (fileMIMEType.hasOwnProperty(suffix)) {
                cordova.plugins.fileOpener2.open(__localUrl, fileMIMEType[suffix]);
            } else {
                service.$cordovaToast.showShortCenter("文件格式不支持！");
            }

        }

    };

    //下载失败的回调
    downloader._error = function (error) {
        if (itemTemp.__fail != null && itemTemp.__fail instanceof Function) {
            itemTemp.__fail(itemTemp);
        }

        itemTemp.__downloadState = "下载失败";
        //downloader.__config.scope.$apply();

        //将下载失败的文件从正在下载队列中弹出
        downloadingList.pop();
        downloader.download();

    };


    downloader._showState = function (attachList, config) {

        // 下载文件历史
        var fileArr = config.storageService.get("downloadFileList");
        //用来判断是否是空对象
        var fileArrJson = JSON.stringify(fileArr);

        for (var i = 0; i < attachList.length; i++) {
            var attachInfo = attachList[i];
            // attachInfo = Tools.setFileIcon(attachInfo);
            attachInfo.__localUrl = "";
            attachInfo.__open = config.open;
            attachInfo.__joinQueue = config.joinQueue;
            attachInfo.__startDownload = config.startDownload;
            attachInfo.__success = config.success;
            attachInfo.__fail = config.fail;
            if (fileArrJson == "{}") {
                attachInfo.__downloadState = "未下载";
            } else {
                for (p in fileArr) {
                    if (p == attachInfo.url) {
                        attachInfo.__downloadState = "已下载，点击打开";
                        attachInfo.__localUrl = fileArr[p];
                    }
                }
                if (attachInfo.__localUrl == "") {
                    attachInfo.__downloadState = "未下载";
                }
            }
        }
    };

    //获得网络类型
    downloader.getNetType = function () {

        var networkState = service.$rootScope.networkState;

        if (networkState == Connection.NONE) {
            return "无网络连接";
        } else if (networkState == Connection.CELL) {
            return "蜂窝网络";
        } else if (networkState == Connection.CELL_2G) {
            return "2G";
        } else if (networkState == Connection.CELL_3G) {
            return "3G";
        } else if (networkState == Connection.CELL_4G) {
            return "4G";
        } else if (networkState == Connection.WIFI) {
            return "WIFI";
        } else if (networkState == Connection.CELL) {
            return "以太网";
        } else {
            return "未识别";
        }
    };

    return downloader;

})();
