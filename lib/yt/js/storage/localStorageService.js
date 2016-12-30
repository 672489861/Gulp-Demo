angular.module("com.yt.mui")
    .factory('LocalStorageService', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage.setItem(key, value);
            },
            get: function (key) {
                return $window.localStorage.getItem(key);
            },
            remove: function (key) {
                return $window.localStorage.removeItem(key);
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }]);