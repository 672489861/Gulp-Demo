angular.module('app.safety.multipleCheck')
    .factory("multipleCheckItemDetailRandomInfoService",
        ['YTService',
            function (YT) {
                var serviceData= [];
                return{
                    clearCachedData: function () {
                        serviceData = [];
                    },
                    queryInfoData:function(id,successCallback){
                        var data = {
                            m: 15004,
                            t: 'v_safety_multiplecheck_spot',
                            order:'spotContentId'
                        };
                        var filter = [{field: 'id', value: id, operator: '=', relation: 'and'}];
                        data.filter = JSON.stringify(filter);

                        YT.query({
                            data: data,
                            successCallback: function (data) {
                                serviceData = data.object;
                                successCallback.call();
                            }
                        });
                    },
                    getServiceData:function(){
                        return serviceData;
                    }
                }
            }])
    .filter('trustHtml', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    });
