angular.module("com.yt.mui", ['app.service'])
    .factory('YTService', ['$http', 'env', 'UserService', 'LocalStorageService', '$ionicPopup',
        '$cordovaToast', '$cordovaImagePicker', '$filter', '$injector', '$ionicActionSheet', '$cordovaCamera',
        function ($http, env, userService, localStorageService, $ionicPopup,
                  $cordovaToast, $cordovaImagePicker, $filter, $injector, $ionicActionSheet, $cordovaCamera) {
            var sending = false;

            return {
                query: function (opts) {
                    var defaultOpts = {
                        url: env.server + 'query.action',
                        data: {
                            'tkt': userService.getTicket(),
                            'rid': userService.getRootOrgId()
                        },
                        successCallback: null,
                        errorCallback: null
                    };

                    opts = angular.merge(defaultOpts, opts);
                    $http({
                        url: opts.url,
                        method: 'POST',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        data: opts.data
                    }).success(function (data, header, config, status) {
                        if (typeof  opts.successCallback == 'function') {
                            opts.successCallback.call(this, data);
                        }
                    }).error(function (data, header, config, status) {
                        if (typeof opts.errorCallback == 'function') {
                            opts.errorCallback.call(this, data);
                        } else {
                            $ionicPopup.alert("数据查询失败!");
                        }
                    });
                },

                insert: function (opts) {
                    this.handle('insert.action', opts);
                },

                update: function (opts) {
                    this.handle('update.action', opts);
                },

                delete: function (opts) {
                    this.handle('delete.action', opts);
                },

                handle: function (url, opts) {
                    if (sending) {
                        return;
                    }
                    sending = true;

                    var defaultOpts = {
                        url: env.server + url,
                        loading: true,
                        data: {
                            'tkt': userService.getTicket(),
                            'rid': userService.getRootOrgId()
                        },
                        successCallback: null,
                        errorCallback: null
                    };
                    opts = angular.merge(defaultOpts, opts);

                    //todo 提交显示出一个蒙版,后期再说
                    $http({
                        method: 'POST',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        data: opts.data,
                        url: opts.url
                    }).success(function (data, header, config, status) {
                        sending = false;
                        if (typeof  opts.successCallback == 'function') {
                            opts.successCallback.call(this, data);
                        } else {
                            $ionicPopup.alert("操作成功!");
                        }
                    }).error(function (data, header, config, status) {
                        sending = false;
                        if (typeof opts.errorCallback == 'function') {
                            opts.errorCallback.call(this, data);
                        } else {
                            $ionicPopup.alert("操作失败,请与系统管理员联系!");
                        }
                    });
                },

                haveRight: function (moduleId) {
                    var moduleList = localStorageService.getObject("moduleList");
                    var currentRootOrgId = userService.getRootOrgId();
                    var length = moduleList.length;

                    for (var i = 0; i < length; i++) {
                        if (moduleList[i].rootOrgId == currentRootOrgId && moduleList[i].moduleId == moduleId) {
                            return true;
                        }
                    }
                    return false;
                },

                getFileUrl: function (savedFileName, uploadSimpleName) {
                    var ticket = userService.getTicket();
                    return env.server + 'download.action?rnd=' + Math.random() + '&tkt=' + ticket + '&fileName=' + savedFileName + '&originalName=' + uploadSimpleName;
                },
                //根据集团编号获取下属所有的分公司
                getSubCompany: function (callback) {
                    var rootId = parseInt(userService.getRootOrgId()) - 1;
                    var filter = [
                        {field: 'type', value: 2, operator: '=', relation: 'and'},
                        {field: 'pid', value: rootId, operator: '=', relation: ''}
                    ];
                    var data = {
                        m: 1003,
                        t: 'org_org',
                        filter: JSON.stringify(filter)
                    };

                    this.query({
                        data: data,
                        successCallback: function (data) {
                            if (200 == data.status) {
                                callback(data.object);
                            } else {
                                $.alert(data.message);
                            }
                        }
                    });
                },

                //获取分公司的下属项目部
                getSubProject: function (callback) {
                    var filter = [
                        {field: 'type', value: 3, operator: '=', relation: 'and'},
                        {field: 'pid', value: userService.getRootOrgId(), operator: '=', relation: ''}
                    ];
                    var data = {
                        m: 1003,
                        t: 'v_org_org_extend',
                        filter: JSON.stringify(filter)
                    };

                    this.query({
                        data: data,
                        successCallback: function (data) {
                            if (200 == data.status) {
                                callback(data.object);
                            } else {
                                $.alert(data.message);
                            }
                        }
                    });
                },


                //项目部获取所属分公司下的所有项目部信息
                getSubProjectByProjectId: function (callback) {
                    var filter = [
                        {field: 'projectId', value: userService.getRootOrgId(), operator: '=', relation: ''}
                    ];

                    var data = {
                        m: 1003,
                        t: 'org_org_relation',
                        filter: JSON.stringify(filter)
                    };
                    var self = this;
                    this.query({
                        data: data,
                        successCallback: function (data) {
                            if (200 == data.status) {
                                filter = [
                                    {field: 'type', value: 3, operator: '=', relation: 'and'},
                                    {field: 'pid', value: data.object[0].companyId, operator: '=', relation: ''},
                                ];
                                data = {
                                    m: 1003,
                                    t: 'org_org',
                                    filter: JSON.stringify(filter)
                                };

                                self.query({
                                    data: data,
                                    successCallback: function (data) {
                                        if (200 == data.status) {
                                            callback(data.object);
                                        } else {
                                            $.alert(data.message);
                                        }
                                    }
                                });
                            } else {
                                $.alert(data.message);
                            }
                        }
                    });
                },

                //注意:此方法只返回id，请慎重调用(仅供项目部身份或分公司身份调用)
                getOwnerCompanyId: function (callback) {
                    var filter = [
                        {field: 'projectId', value: userService.getRootOrgId(), operator: '=', relation: 'or'},
                        [
                            {field: 'companyId', value: userService.getRootOrgId(), operator: '=', relation: 'and'},
                            {field: 'projectId', value: 0, operator: '=', relation: ''}
                        ]
                    ];

                    var data = {
                        m: 1003,
                        t: 'org_org_relation',
                        filter: JSON.stringify(filter)
                    };

                    this.query({
                        data: data,
                        successCallback: function (data) {
                            if (200 == data.status) {
                                callback(data.object[0].companyId);
                            } else {
                                $.alert(data.message);
                            }
                        }
                    });
                },

                //获取当前登陆用户的对应的集团ID
                getOwnerGroupId: function (callback) {
                    var filter = [
                        {field: 'projectId', value: userService.getRootOrgId(), operator: '=', relation: 'or'},
                        [
                            {field: 'companyId', value: userService.getRootOrgId(), operator: '=', relation: 'and'},
                            {field: 'projectId', value: 0, operator: '=', relation: 'or'}
                        ],
                        [
                            {field: 'groupId', value: userService.getRootOrgId(), operator: '=', relation: 'and'},
                            {field: 'companyId', value: 0, operator: '=', relation: 'and'},
                            {field: 'projectId', value: 0, operator: '=', relation: ''}
                        ]
                    ];

                    var data = {
                        m: 1003,
                        t: 'org_org_relation',
                        filter: JSON.stringify(filter)
                    };

                    this.query({
                        data: data,
                        successCallback: function (data) {
                            if (200 == data.status) {
                                callback(data.object[0].groupId);
                            } else {
                                $.alert(data.message);
                            }
                        }
                    });
                },

                //获取当前用户顶层集团信息
                getOwnerGroup: function (callback) {
                    var self = this;
                    YTPMP.service.getOwnerGroupId(function (groupId) {
                        var filter = [
                            {field: 'id', value: (groupId - 1), operator: '=', relation: ''}
                        ];
                        var data = {
                            m: 1003,
                            t: 'org_org',
                            filter: JSON.stringify(filter)
                        };

                        self.query({
                            data: data,
                            successCallback: function (data) {
                                if (200 == data.status) {
                                    callback(data.object[0]);
                                } else {
                                    $.alert(data.message);
                                }
                            }
                        });
                    });
                },

                // 下载或查看附件
                download: function (attach) {
                    var url = attach.url.toLocaleLowerCase();
                    var ticket = userService.getTicket();
                    if (url.indexOf(".jpg") >= 0 || url.indexOf(".jpeg") >= 0 || url.indexOf(".png") >= 0 || url.indexOf(".bmp") >= 0 || url.indexOf(".gif") >= 0) {
                        url = attach.url.replace("\\", "/");
                        url = env.server + "download.action?rnd=" + Math.random() + "&tkt=" + ticket + "&fileName=" + url;
                        PhotoViewer.show(url);
                    } else {
                        var confirmPopup = $ionicPopup.confirm({
                            title: '提示',
                            template: '该附件必须下载才能查看,确定下载么?',
                            cancelText: '取消',
                            okText: '确定'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                var obj = [{
                                    name: attach.name,
                                    url: attach.url
                                }];
                                downloadTool.init({
                                    attachList: obj,
                                    server: env.server,
                                    injector: $injector,
                                    open: true,
                                    ticket: ticket,
                                    storageService: localStorageService,
                                    joinQueue: function (item) {
                                    },
                                    //（非必须） 正在下载的回调
                                    startDownload: function () {
                                        $cordovaToast.showShortBottom("文件下载中,请稍后");
                                    },
                                    success: function (item, fileEntry) {
                                    },
                                    fail: function (item) {
                                        $ionicPopup.alert({title: '提示', template: item.name + '下载失败,请稍后再试!'});
                                    }
                                });
                                downloadTool.download(obj[0]);
                            }
                        });
                    }
                },

                // 添加附件
                addAttachment: function (scope, callback, editCallback) {
                    $ionicActionSheet.show({
                        buttons: [
                            {text: '相机'},
                            {text: '图库'}
                        ],
                        cancelText: '关闭',
                        cancel: function () {
                            return true;
                        },
                        buttonClicked: function (index) {
                            switch (index) {
                                case 0:
                                    takePhoto(scope, callback, editCallback);
                                    break;
                                case 1:
                                    pickImage(scope, callback, editCallback);
                                    break;
                                default:
                                    break;
                            }
                            return true;
                        }
                    });

                    var takePhoto = function (scope, callback, editCallback) {
                        var options = {
                            quality: 100,                                            //相片质量0-100
                            destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
                            sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
                            allowEdit: false,                                        //在选择之前允许修改截图
                            encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
                            targetWidth: 800,                                        //照片宽度
                            targetHeight: 800,                                       //照片高度
                            mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
                            cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
                            popoverOptions: CameraPopoverOptions,
                            saveToPhotoAlbum: true, //保存进手机相册
                            correctOrientation: true
                        };

                        $cordovaCamera.getPicture(options).then(function (imageData) {
                            if (editCallback != undefined) {
                                return editCallback(imageData);
                            } else {
                                uploadAttachFile(imageData, scope, callback);
                            }
                        }, function (err) {
                        });
                    };

                    var pickImage = function (scope, callback, editCallback) {
                        var options = {
                            maximumImagesCount: scope.maximumImagesCount || 5,
                            width: 800,
                            height: 800,
                            quality: 100
                        };
                        $cordovaImagePicker.getPictures(options)
                            .then(function (results) {
                                if (editCallback != undefined) {
                                    return editCallback(results);
                                } else {
                                    for (var i = 0; i < results.length; i++) {
                                        uploadAttachFile(results[i], scope, callback);
                                    }
                                }
                            }, function (error) {
                            });
                    };

                    var uploadAttachFile = function (imageData, scope, callback) {
                        var item = {src: imageData, statusMsg: '上传中...', status: 0, statusClass: ''};
                        var ticket = userService.getTicket();
                        callback(item);

                        // 放入提供的数组中
                        var options = new FileUploadOptions();
                        options.fileKey = "file";
                        options.fileName = imageData.substr(imageData.lastIndexOf('/') + 1);
                        options.mimeType = "text/plain";

                        // 执行上传
                        var ft = new FileTransfer();
                        ft.upload(imageData, encodeURI(env.server + "/upload.action?rnd=" + Math.random() + "&tkt=" + ticket), function (data) {
                            var object = JSON.parse(data.response).object[0];

                            item.statusMsg = '上传成功!';
                            item.status = 200;
                            item.statusClass = 'green';
                            item.data = {
                                name: object.uploadSimpleName,
                                url: object.savedFileName
                            };
                            scope.$apply();
                        }, function () {
                            item.statusMsg = '上传失败!';
                            item.status = 500;
                            item.statusClass = 'red';
                            item.data = {};
                            scope.$apply();
                        }, options);
                        return item;
                    }
                },

                // 添加完查看或删除附件
                previewOrDelete: function (imgIndex, arr, callback) {
                    var buttons = [{text: '预览'}];
                    if (callback != undefined) {
                        buttons.push({text: '编辑'});
                    }
                    $ionicActionSheet.show({
                        buttons: buttons,
                        destructiveText: '删除',
                        cancelText: '关闭',
                        cancel: function () {
                            return true;
                        },
                        buttonClicked: function (index) {
                            if (index == 0) {
                                PhotoViewer.show(arr[imgIndex].src);
                            } else {
                                callback();
                            }
                            return true;
                        },
                        destructiveButtonClicked: function () {
                            arr.splice(imgIndex, 1);
                            return true;
                        }
                    });
                },

                // 验证附件是否上传成功
                validateAttachs: function (attachs) {
                    for (var i = 0; i < attachs.length; i++) {
                        if (attachs[i].status == 0 || attachs[i].status == 500) {
                            $ionicPopup.alert({title: '提示', template: '一个或多个文件正在上传或上传失败,请删除后重新上传!'});
                            return false;
                        }
                    }
                    return true;
                },

                uploadBase64Attach: function (imageData, callback) {
                    var item = {statusMsg: '上传中...', status: 0, statusClass: ''};
                    var ticket = userService.getTicket();
                    try {
                        $http({
                            url: env.server + "/uploadBase64.action?rnd=" + Math.random(),
                            method: 'POST',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            data: {
                                pic: imageData,
                                tkt: ticket
                            }
                        }).success(function (data) {
                            var object = data.object[0];

                            item.statusMsg = '上传成功!';
                            item.status = 200;
                            item.statusClass = 'green';
                            item.data = {
                                name: object.uploadSimpleName,
                                url: object.savedFileName
                            };
                            callback(item);
                        }).error(function () {
                            item.statusMsg = '上传失败!';
                            item.status = 500;
                            item.statusClass = 'red';
                            item.data = {};
                        });
                    } catch (e) {
                        alert(e);
                    }
                },
                clone: function (obj) {
                    var o;
                    switch (typeof obj) {
                        case 'undefined':
                            break;
                        case 'string'   :
                            o = obj + '';
                            break;
                        case 'number'   :
                            o = obj - 0;
                            break;
                        case 'boolean'  :
                            o = obj;
                            break;
                        case 'object'   :
                            if (obj === null) {
                                o = null;
                            } else {
                                if (obj instanceof Array) {
                                    o = [];
                                    for (var i = 0, len = obj.length; i < len; i++) {
                                        o.push(arguments.callee(obj[i]));
                                    }
                                } else {
                                    o = {};
                                    for (var k in obj) {
                                        o[k] = arguments.callee(obj[k]);
                                    }
                                }
                            }
                            break;
                        default:
                            o = obj;
                            break;
                    }
                    return o;
                }
            }
        }]).filter("showAttachIcon", function () {
        return function (fileName) {
            var suffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
            var url = '';
            switch (suffix) {
                case 'jpg':
                case 'png':
                case 'gif':
                case 'jpeg':
                    url = "lib/yt/img/img.svg";
                    break;
                case 'pdf':
                    url = "lib/yt/img/pdf.svg";
                    break;
                case 'doc':
                case 'docx':
                    url = "lib/yt/img/doc.svg";
                    break;
                case 'xls':
                case 'xlsx':
                    url = "lib/yt/img/xls.svg";
                    break;
                case 'ppt':
                case 'pptx':
                    url = "lib/yt/img/ppt.svg";
                    break;
                case 'rar':
                case 'zip':
                case '7z':
                    url = "lib/yt/img/rar.svg";
                    break;
                default:
                    url = "lib/yt/img/txt.svg";
            }
            return url;
        }
    });

