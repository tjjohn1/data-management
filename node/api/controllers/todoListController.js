'use strict';

var fs = require('fs');
var async = require('async');
var path = require('path');
var csv = require('fast-csv');
var mongoose = require('mongoose');
var DayTotal = require('../models/DayTotal');
var concat = require('concat-files');

var dateString = getDateString();

exports.import_day_totals = function(req, res) {
    var new_day_totals = new DayTotal(req.body);
    new_day_totals.save(function(err, dayTotal) {
        if (err)
            res.send(err);
        res.json(dayTotal);
    });
};

function checkExist(date, vendor, callback){
    if (vendor === "ams") {
        vendor = "AMS";
    } else if (vendor === "ame") {
        vendor = "AMERICAN";
    } else if (vendor === "win") {
        vendor = "WINTERSKY";
    } else if (vendor === "xci") {
        vendor = "XCITE";
    }
    DayTotal.find({ vendor: vendor, date: date }).count(function(err, count)
    {
        if (err)
            console.log(err);
        callback(count);
    });
    console.log("Done in checkExist");
}

exports.combineFiles = function(req, res) {
    var fileName = req.headers['index'];
    move(false, "Y:\\csbatch.txt", "Y:\\work folder\\csbatch.txt");
    move(false, "X:\\csbatch.txt", "X:\\work folder\\csbatch.txt");
    if (index === 1) {
        concat([
            'Y:\\csbatch.txt',
            'X:\\csbatch.txt'
        ], 'x:\\csbatch.txt', function (err) {
            if (err) throw err
            console.log('done');
        });
    }
    if (index === 1) {
        concat([
            'Y:\\csbatch.txt',
            'X:\\csbatch.txt'
        ], 'Y:\\csbatch.txt', function (err) {
            if (err) throw err
            console.log('done');
        });
    }
};

exports.list_all_files = function(req, res) {
    DayTotal.find({}, function(err, daytotal)
    {
        if (err)
            res.send(err);
        res.json(daytotal);
    });
};

exports.list_day_files = function(req, res) {
    var dateVendors = [];
    var date = req.headers['date'];
    console.log("DateHeader :" + date);
    DayTotal.find({ date: date}).select('vendor').exec(function(err, daytotal)
    {
        if (err)
            res.send(err);
        daytotal.forEach(function(item) {
            dateVendors.push(item.vendor);
        });
        res.json(dateVendors);
    });
};

exports.list_vendor_files = function(req, res) {
    var vendorDates = [];
    var vendor = req.headers['vendor'];
    console.log("VendorHeader :" + vendor);
    DayTotal.find({ vendor: vendor}).select('date').exec(function(err, daytotal)
    {
        if (err)
            res.send(err);
        daytotal.forEach(function(item) {
            vendorDates.push(item.date);
        });
        res.json(vendorDates);
    });
};


exports.get_files= function(req, res) {
    var filePath = "C:\\Cummins_Export_Files";
    fs.readdir(filePath, function (err, items) {
        var files = {files: items.filter(extension)};
        console.log(files);
        res.contentType('application/json');
        res.send(files);
    });
};

function extension(element) {
    console.log(element);
    return element.substr(element.length - 10) === 'Export.csv';
}

exports.processCSV = function(req, res) {
    var path = '';
    var fileName = req.headers['file'];
    var json = '';
    var csvHeaders = {
            headers: ['terminal', 'ones', 'fives', 'tens', 'twenties', 'fifties', 'hundreds']
    };
    var vendor = fileName.substring(0,3).toLowerCase();
    checkExist(dateString, vendor, function(count) {
        console.log("FileName: " + fileName);
        console.log("Count: " + count);


        if (count !== 0) {
            res.contentType('application/text');
            res.send("Data already imported for " + vendor + " on " + dateString);
        } else {
            switch (vendor) {
                case "ams":
                    path = "C:\\Cummins_Export_Files\\" + fileName;
                    console.log("Path: " + path);
                    readCSV(path, csvHeaders.headers, 'Terminal', function(response) {
                        //Working now!!
                        console.log("Processing AMS");
                        move(false, path, "C:\\Terminals_Export_Reports\\AMS\\" + dateString + "_AMS.csv");
                        setTimeout(function () {
                            move(true, path, "C:\\Cummins_Export_Files\\" + dateString + "_AMS.csv");
                        }, 2000);
                        res.contentType('application/text');
                        res.send(response);
                    });
                    break;
                case "ame":
                    path = "C:\\Cummins_Export_Files\\" + fileName;
                    console.log("Path: " + path);
                    readCSV(path, csvHeaders.headers, 'Terminal', function(response) {
                        console.log("Processing AMERICAN");
                        move(false, path, "C:\\Terminals_Export_Reports\\AMERICAN\\" + dateString + "_AMERICAN.csv");
                        setTimeout(function () {
                            move(true, path, "C:\\Cummins_Export_Files\\" + dateString + "_AMERICAN.csv");
                        }, 2000);
                        res.contentType('application/text');
                        res.send(response);
                    });
                    break;
                case "win":
                    path = "C:\\Cummins_Export_Files\\" + fileName;
                    console.log("Path: " + path);
                    readCSV(path, csvHeaders.headers, 'Terminal', function(response) {
                    console.log("Processing AMS");
                        move(false, path, "C:\\Terminals_Export_Reports\\WINTERSKY\\" + dateString + "_WINTERSKY.csv");
                        setTimeout(function () {
                            move(true, path, "C:\\Cummins_Export_Files\\" + dateString + "_WINTERSKY.csv");
                        }, 2000);
                        res.contentType('application/text');
                        res.send(response);
                    });
                    break;
                case "xci":
                    path = "C:\\Cummins_Export_Files\\" + fileName;
                    console.log("Path: " + path);
                    readCSV(path, csvHeaders.headers, 'Terminal', function(response) {
                        console.log("Processing XCITE");
                        move(false, path, "C:\\Terminals_Export_Reports\\XCITE\\" + dateString + "_XCITE.csv");
                        setTimeout(function () {
                            move(true, path, "C:\\Cummins_Export_Files\\" + dateString + "_XCITE.csv");
                        }, 2000);
                        res.contentType('application/text');
                        res.send(response);
                    });
                    break;
            }
        }
    });
};

function getDateString() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    console.log("Date String: " + year + "_" + month + "_" + day);
    return(year + "_" + month + "_" + day);
}

function move(unlink, oldPath, newPath) {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        if(unlink){
        readStream.on('close', function () {
                    fs.unlink(oldPath);
                });
        }
        readStream.pipe(writeStream);
}

function readCSV(filePath, fileHeaders, modelName, callback) {
    fs.exists(filePath, function (exists) {
        if (exists) { //test make sure the file exists
            var i = 0;
            var grandSum = 0;
            var newDayTotal = new DayTotal();
            newDayTotal.terminals = [];
            newDayTotal._id = new mongoose.Types.ObjectId();
            newDayTotal.date = getDateString();
            newDayTotal.vendor = "AMS";
            var terminalArray = [];

            var stream = fs.createReadStream(filePath);

            csv.fromStream(stream, fileHeaders)
                .on("data", function (data) {
                    var sum = parseInt(data[1]) + parseInt(data[2]) + parseInt(data[3]) + parseInt(data[4]) + parseInt(data[5]) + parseInt(data[6]);
                    //console.log("Sum for " + data[0] + ": " + sum);
                    grandSum += sum;
                    if(i === 0){
                        newDayTotal.terminals = [{terminal: data[0], ones: data[1], fives: data[2], tens: data[3], twenties: data[4], fifties: data[5], hundreds: data[6], total: sum}];
                        //console.log(JSON.stringify({terminal: data[0], ones: data[1], fives: data[2], tens: data[3], twenties: data[4], fifties: data[5], hundreds: data[6], total: sum}, null, 2));
                    } else {
                        newDayTotal.terminals.push({terminal: data[0], ones: data[1], fives: data[2], tens: data[3], twenties: data[4], fifties: data[5], hundreds: data[6], total: sum});
                        //console.log(JSON.stringify({terminal: data[0], ones: data[1], fives: data[2], tens: data[3], twenties: data[4], fifties: data[5], hundreds: data[6], total: sum}, null, 2));
                    }
                    i++;
                })
                .on("end", function () {
                    newDayTotal.grand_total = grandSum;
                    newDayTotal.save(function (err, data) {
                        if (err) console.log(err);
                        else {
                            callback("Process Complete");
                        }
                    });
                });
        }
    })
}
