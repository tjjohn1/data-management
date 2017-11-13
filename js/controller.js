'use strict';

var controllers = angular.module('controllers', []);

controllers.controller('Hello', function($scope, $http, $window, $filter) {

        //var date = new Date();
        //$scope.today = $filter('date')(date, "yyyy-MM-dd");

        $("#datepicker").datepicker({
            onSelect: function() {
                var dateObject = $(this).datepicker('getDate');
                dateObject = $filter('date')(dateObject, "yyyy-MM-dd");
                console.log("FormatDate: " + dateObject);
                selectedDateChanged(dateObject);
            }
        });

        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";

        $scope.vendors = ["AMS", "AMERICAN", "WINTER SKY", "XCITE"];

        $http({
            url: 'http://localhost:3000/imports',
            method: "GET",
            headers: {"Content-type": "application/json"}
        }).then(function (response) {
            $scope.files = response.data;
            console.log(response.data);
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
                    //$scope.convertedCSV = response.data;
                });
            }
        };

        $scope.selectedVendorChanged = function(x) {
            console.log("Vendor Selected: " + x);
            $scope.vendor = x;
                $http({
                    url: 'http://localhost:3000/files/vendor',
                    method: "GET",
                    headers: {"vendor": x, "Content-type": "application/json"}
                }).then(function (response) {
                    $scope.vendorDates = response.data;
                    console.log(response.data);
                });
        };

        $scope.vendorDateChanged = function(x) {
            $scope.date = x;
            console.log("Report Date: " + x);
            $http({
                url: 'http://localhost:3000/file',
                method: "GET",
                headers: {'dstring': x, 'vendor': $scope.vendor, 'Content-type': 'application/json'}
            }).then(function (response) {
                console.log(response.data);
            });
        };

        function selectedDateChanged(x) {
            x = x.replace(/-/g, '_');
            console.log("Date: " + x);
            $scope.date = x;
                $http({
                    url: 'http://localhost:3000/files/date',
                    method: "GET",
                    headers: {'dstring': x, 'Content-type': 'application/json'}
                }).then(function (response) {
                    console.log(response.data);
                    $scope.dateVendors = response.data;
                });
        };

        $scope.dateVendorChanged = function(x) {
            $scope.vendor = x;
            $http({
                url: 'http://localhost:3000/file',
                method: "GET",
                headers: {'dstring': $scope.date, 'vendor': x, 'Content-type': 'application/json'}
            }).then(function (response) {
                console.log(response.data);
            });
        };


        $scope.combineFiles = function() {
            var mpsSelect = document.getElementById('MPSSelection');
            var index = mpsSelect.selectedIndex;
            console.log("Index: " + index);
            if(index > 0){
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