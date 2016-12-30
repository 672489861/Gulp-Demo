angular.module('app.frame.dashboard')
    .factory("DashboardService", ['YTService', 'LocalStorageService', 'UserService', '$sce',
        function (YT, localStorageService, userService, $sce) {

            var resultNews = [], news = [],
                pageIndex = 0,
                pageSize = 10,
                hasNextPage = true, newsBadge = {};

            return {
                getNewsList: function () {
                    return news;
                },
                loadListData: function (successCallback) {
                    resultNews.length = 0;
                    ++pageIndex;
                    var self = this;
                    YT.query({
                        data: self.getSearchData(),
                        successCallback: function (data) {
                            self.loadListDataCallback(data);
                            successCallback.call();
                        }
                    });
                },
                getSearchData: function () {
                    var data = {
                        m: 1005,
                        t: 'v_dashboard_news',
                        order: 'datetime desc',
                        page: pageIndex,
                        rows: pageSize
                    };
                    var filter = this.getSearchFilter();
                    data.filter = JSON.stringify(filter);
                    data.params = JSON.stringify({
                        isMobile: true
                    });
                    return data;
                },
                getSearchFilter: function () {
                    var filter = [];
                    filter.push([
                        {field: 'userId', value: 0, operator: '=', relation: 'OR'},
                        {field: 'userId', value: userService.getUserId(), operator: '=', relation: 'AND'}
                    ]);
                    return filter;
                },
                loadListDataCallback: function (data) {
                    var pageInfo = data.object;
                    for (var i = 0; i < pageInfo.items.length; i++) {
                        resultNews.push(pageInfo.items[i]);
                    }
                    this.structureNews();
                    if (pageIndex >= pageInfo.pageCount) {
                        hasNextPage = false;
                    } else {
                        hasNextPage = true;
                    }
                },
                refreshListData: function (successCallBack) {
                    this.clearCachedData();
                    this.loadListData(successCallBack);
                },
                clearCached: function () {
                    pageIndex = 0;
                    hasNextPage = true;
                    news = [];
                    resultNews = [];
                },
                clearCachedData: function () {
                    pageIndex = 0;
                    hasNextPage = true;
                    news = [];
                    resultNews = [];
                    newsBadge = {};
                },
                hasNextPage: function () {
                    return hasNextPage;
                },
                structureNews: function () {
                    var tempObj = {
                        pushTime: resultNews[0].pushTime,
                        details: []
                    };
                    for (var i = 0; i < resultNews.length; i++) {
                        var resultNew = resultNews[i];
                        resultNew.content = $sce.trustAsHtml(resultNew.content + resultNew.url);
                        if (resultNew.moduleId == null) {
                            resultNew.imgSrc = "modules/frame/dashboard/img/gg.svg";
                        } else if (resultNew.moduleId == 15001) {
                            resultNew.imgSrc = "modules/frame/dashboard/img/safety.svg";
                        } else if (resultNew.moduleId == 16001) {
                            resultNew.imgSrc = "modules/frame/dashboard/img/quality.svg";
                        } else if (resultNew.moduleId.indexOf("1300") != -1) {
                            resultNew.imgSrc = "modules/frame/dashboard/img/subcontract.svg";
                        } else if (resultNew.moduleId.indexOf("6001") != -1 || resultNew.moduleId.indexOf("6002") != -1 || resultNew.moduleId.indexOf("6003") != -1) {
                            resultNew.imgSrc = "modules/frame/dashboard/img/contract.svg";
                        } else if (resultNew.moduleId.indexOf("18001") != -1 || resultNew.moduleId.indexOf("18002") != -1) {
                            resultNew.imgSrc = "modules/frame/dashboard/img/responsible.svg";
                        } else if (resultNew.moduleId.indexOf("10001") != -1 || resultNew.moduleId.indexOf("10003") != -1 || resultNew.moduleId.indexOf("10004") != -1
                            || resultNew.moduleId.indexOf("10005") != -1 || resultNew.moduleId.indexOf("10007") != -1 || resultNew.moduleId.indexOf("10008") != -1) {
                            resultNew.imgSrc = "modules/frame/dashboard/img/material.svg";
                        } else if(resultNew.moduleId.indexOf("12001") != -1 ||resultNew.moduleId.indexOf("12002") != -1 ||resultNew.moduleId.indexOf("12003") != -1){
                            resultNew.imgSrc = "modules/frame/dashboard/img/device.svg";
                        }

                        if (resultNew.pushTime == tempObj.pushTime) {
                            tempObj.details.push(resultNew);
                        } else {
                            news.push(tempObj);
                            tempObj = {
                                pushTime: resultNew.pushTime,
                                details: []
                            };
                            tempObj.details.push(resultNew);
                        }
                    }
                    news.push(tempObj);
                },
                queryNewsNum: function (callback) {
                    YT.query({
                        data: {
                            m: 1005,
                            t: 'v_dashboard_newscount',
                            filter: JSON.stringify([
                                {field: 'userId', value: userService.getUserId(), operator: '=', relation: 'AND'},
                                {field: 'type', value: 2, operator: '=', relation: 'AND'},
                                {field: 'state', value: 0, operator: '=', relation: 'AND'}
                            ])
                        },
                        successCallback: function (data) {
                            if (data.object.length == 0) {
                                newsBadge = {};
                            } else {
                                newsBadge.num = data.object[0].num;
                            }
                            callback();
                        }
                    });
                },
                getPageIndex: function () {
                    return pageIndex;
                },
                queryNewsWithId: function (newsId, callback) {
                    YT.query({
                        data: {
                            m: 1005,
                            t: 'v_dashboard_news',
                            filter: JSON.stringify([
                                {field: 'id', value: newsId, operator: '=', relation: 'AND'}
                            ])
                        },
                        successCallback: function (data) {
                            if (data.status == 200) {
                                callback(data.object[0]);
                            }

                        }
                    });
                },
                getNewsBadge: function () {
                    return newsBadge;
                }
            }

        }]);