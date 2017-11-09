'use strict';

var app = angular.module('demo', [])

    app.controller('Hello', function($scope, $http, $window) {

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
                    console.log($scope.file + " Successfully processed");
                    console.log("Response: " + response.data);
                    $scope.convertedCSV = response.data;
                });
            }
        };

        $scope.combineFiles = function() {
            var mpsSelect = document.getElementById('MPSSelection');
            var index = mpsSelect.selectedIndex;
            console.log("Index: " + index);
            if(index > 0){
                var mpsSelect = document.getElementById('mps_selection');
                $http({
                    url: 'http://localhost:3000/imports/combine',
                    method: "POST",
                    headers: {"index": index}
                }).then(function (response) {
                    console.log("Files successfully combined on MPS " + (index + 1));
                    //$scope.convertedCSV = response.data;
                });
            } else {
                $window.alert("Please select an MPS");
            }
        };
    });