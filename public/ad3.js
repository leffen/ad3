'use strict';

var app = angular.module('ad3', ["nvd3ChartDirectives", "ngResource", "ad3_utils"])
  .service('Data', ['$resource', function ($resource) {
    return $resource("/api/data", {}, {query: {method: 'GET', isArray: true}}).query();
  }])
  .controller('MainController', ['$scope', 'Data', 'Ad3Utils',
    function ($scope, Data, Utils) {
      $scope.info = {};
      $scope.info.title = 'Transkodingstid / lengde';
      $scope.info.data = [{key: "border_line", values: []}];

      Data.$promise.then(function (data) {
        $scope.info.data = [{key: 'assets', values: data},
                            {key: "border_line", values: [[0, 1200],[450, 2550]]}
        ];
      });

      $scope.xAxisTickFormatFunction = function () { return function (secs) {return Utils.secondsToTime(secs);};};
      $scope.yAxisTickFormatFunction = function () {return function (d) {return Utils.secondsToTime(d);};};
      $scope.infoColor = function () {
        return function (d, i) {
          if (i === 0) return 'blue';
          return 'red';
        };
      };
      $scope.infoTooltip = function(){
        return function(key, x, y, e, graph) {
          if(e.seriesIndex==1) return "";
          return  'Videoklipp' +
            '<h1>' + e.point[2] + '</h1>' +
            '<p> server:' + e.point[4]+ ' - format:' + e.point[3] + '</p>';
        };
      };

      $scope.callback = function(){
        return function(chart){

          chart.lines.dispatch.on('elementClick', function(e){
            $scope.show_asset(e);
          });

        };
      };

      $scope.show_asset = function(e) {
        console.log(e);
        $scope.info.asset_id = e.point[2];
        $scope.info.server = e.point[4];
        $scope.info.format = e.point[3];
        $scope.info.lengde = e.point[0];



        $scope.$digest();
      };


    }]);

