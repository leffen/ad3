'use strict';

var app = angular.module('ad3', ["nvd3ChartDirectives","ngResource"])
  .service('Data', ['$resource', function ($resource) {
    return $resource("/api/data", {}, {query: {method: 'GET', isArray: true}}).query();
  }])
  .factory('Utils', function() {
    var factory = {};

    factory.secondsToTime = function (seconds) {
      var hours   = Math.floor(seconds / 3600);
      var minutes = Math.floor((seconds - (hours * 3600)) / 60);
      var seconds = seconds - (hours * 3600) - (minutes * 60);
      var time = "";

      if (hours != 0) {
        time = hours+":";
      }
      if (minutes != 0 || time !== "") {
        minutes = (minutes < 10 && time !== "") ? "0"+minutes : String(minutes);
        time += minutes+":";
      }
      if (time === "") {
        time = seconds+"s";
      }
      else {
        time += (seconds < 10) ? "0"+seconds : String(seconds);
      }
      return time;
    };

    return factory;
  })
  .controller('MainController',['$scope','Data','Utils',
            function($scope,Data,Utils)
            {
              $scope.info ={}
              $scope.info.title='Angular & D3';
              $scope.r2_data = [{key: "test", values: []}];

              Data.$promise.then(function (data) {console.log(data);$scope.r2_data = [{key: 'assets',values: data}];});

              $scope.xAxisTickFormatFunction = function () { return function (secs) {return Utils.secondsToTime(secs);};};
              $scope.yAxisTickFormatFunction = function () {return function (d) {return Utils.secondsToTime(d);};};


            }]);

