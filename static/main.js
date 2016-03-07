(function () {

  'use strict';

  angular.module('WordcountApp', [])

    .controller('WordcountController', ['$scope', '$log', '$http', '$timeout', function($scope, $log, $http, $timeout) {
    $scope.submitButtonText = "Submit";
    $scope.loading = false;
    $scope.urlError = false;
    $scope.wordcounts = {};

    $scope.getResults = function() {

      // get the URL from the input
      var userInput = $scope.input_url;
      // fire the API request

        $http.post('/start', {"url": userInput}).
          success(function(results) {
            $log.log(results);
            getWordCount(results);
            $scope.wordcounts = null;
            $scope.loading = true;
            $scope.submitButtonText = "Loading...";
            $scope.urlError = false;
          }).
          error(function(error) {
            $log.log(error);
          });
        };

        function getWordCount(jobID) {

          var timeout = "";

          var poller = function() {
            // fire another request
            $http.get('/results/'+jobID).
              success(function(data, status, headers, config) {
                if(status === 202) {
                  $log.log(data, status)
                } else if (status === 200){
                  $log.log(data);
                  $scope.loading = false;
                  $scope.submitButtonText = "Submit";
                  $scope.wordcounts = data;
                  $timeout.cancel(timeout);
                  return false;
                }
                // continue to call the poller() function every 2 seconds
                // until the timeout is cancelled
                timeout = $timeout(poller, 2000);
              }).
                error(function(error) {
                  $log.log(error);
                  $scope.loading = false;
                  $scope.submitButtonText = "Submit";
                  $scope.urlError = true;
                });
          };
          poller();
        }

    }

  ])
   .directive('wordCountChart', function ($parse) {
      return {
         restrict: 'E',
         replace: true,
         template: '<div id="chart"></div>',
         link: function (scope) {

             scope.$watch('wordcounts', function() {
              var data = scope.wordcounts
              d3.select('#chart').selectAll('*').remove();
              for(var word in data) {
                var chart = d3.select('#chart')
               .append("div").attr("class", "chart")
               .selectAll('div')
               .data(word[0]).enter()
               .append("div")
               .transition().ease("elastic")
               .style("width", function() { return (data[word] * 20) + "px"; })
               .text(function() {
                  return word + '  :  ' + data[word] ;
                });
              }
             }, true)

         }
      };
   });


}());


