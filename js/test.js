'use strict';

var app = angular.module('demo', [])

    app.controller('Hello', function($scope, $http) {

        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";

        $http({
            url: 'http://localhost:3000/imports',
            method: "GET",
            headers: {"Content-type": "application/json"}
        }).then(function (response) {
            $scope.files = response.data;
        });

        $scope.selectedFilesChanged = function (x) {
            $scope.file = x;
            console.log("SelectedFilesChanged: " + x);
        };

        $scope.processCSV = function() {
            if($scope.file){
                $http({
                    url: 'http://localhost:3000/imports/process',
                    method: "POST",
                    headers: {"file": $scope.file}
                }).then(function (response) {
                    $window.alert($scope.file + "Successfully processed");
                    consnole.log("Reponse: " + response.data);
                });
            }
        };
    });