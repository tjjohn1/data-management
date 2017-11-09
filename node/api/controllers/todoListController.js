'use strict';

var fs = require('fs');
var path = require('path');
var csv = require('fast-csv');
var mongoose = require('mongoose');
var DayTotal = require('../models/DayTotal');
var concat = require('concat-files');

exports.import_day_totals = function(req, res) {
    var new_day_totals = new DayTotal(req.body);
    new_day_totals.save(function(err, dayTotal) {
        if (err)
            res.send(err);
        res.json(dayTotal);
    });
};

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

exports.list_all_tasks = function(req, res) {
    DayTotal.find({}, function(err, daytotal)
    {
        if (err)
            res.send(err);
        res.json(daytotal);
    });
};

/*
exports.create_a_task = function(req, res) {
    var new_task = new Task(req.body);
    new_task.save(function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.read_a_task = function(req, res) {
    Task.findById(req.params.taskId, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.update_a_task = function(req, res) {
    Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.delete_a_task = function(req, res) {

    Task.remove({
        _id: req.params.taskId
    }, function(err, task) {
        if (err)
            res.send(err);
        res.json({ message: 'Task successfully deleted' });
    });
};
*/

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
    return element.substr(element.length - 3) === 'csv';
}

exports.processCSV = function(req, res) {
    var csvHeaders = {
            headers: ['terminal', 'ones', 'fives', 'tens', 'twenties', 'fifties', 'hundreds']
    };
    var dateString = getDateString();
    var fileName = req.headers['file'];
    console.log("FileName: " + fileName);
    console.log("Substring: " + fileName.substring(0,3).toLowerCase());
    switch(fileName.substring(0,3).toLowerCase()) {
        case "ams":
            var path = "C:\\Cummins_Export_Files\\" + fileName;
            console.log("Path: " + path);
            //Working now!!
            var json = readCSV(path, csvHeaders.headers, 'Terminal');
            console.log("Processing AMS");
            res.contentType('application/text');
            res.send("All Done");
            /*
            setTimeout(function(){
                move(false, path, "C:\\Terminals_Export_Reports\\AMS\\" + dateString + "_AMS.csv");
                setTimeout(function(){
                    move(true, path, "C:\\Cummins_Export_Files\\" + dateString + "_AMS.csv");
                }, 2000);
                res.contentType('application/json');
                res.send(json);
            }, 7000);
            */
            break;
            /*
        case "ame":
            console.log("Processing American");
            //Excel.Run("Personal.xlsb!TerminalsAmerican");
            setTimeout(function(){
                move("C:\\Cummins_Export_Files\\AMERICAN_Export.xlsx", "C:\\Terminals_Export_Reports\\AMERICAN\\" + dateString + "_AMERICAN.xlsx");
                move("C:\\Cummins_Export_Files\\" + fileName, "C:\\Cummins_Export_Files\\" + dateString + "_AMERICAN.csv");
                res.contentType('application/json');
                res.send("C:\\Terminals_Export_Reports\\AMS\\" + dateString + "_AMS.xlsx");
            }, 5000);
            break;
        case "win":
            console.log("Processing Winter Sky");
            Excel.Run("Personal.xlsb!TerminalsWinterSky");
            setTimeout(function(){
                move("C:\\Cummins_Export_Files\\AMS_Export.xlsx", "C:\\Terminals_Export_Reports\\WINTERSKY\\" + dateString + "_WINTERSKY.xlsx");
                move("C:\\Cummins_Export_Files\\" + fileName, "C:\\Cummins_Export_Files\\" + dateString + "_WINTERSKY.csv");
                res.contentType('application/json');
                res.send("C:\\Terminals_Export_Reports\\AMS\\" + dateString + "_AMS.xlsx");
            }, 5000);
            break;
        case "xci":
            console.log("Processing Excite");
            Excel.Run("Personal.xlsb!TerminalsExcite");
            setTimeout(function(){
                move("C:\\Cummins_Export_Files\\AMS_Export.xlsx", "C:\\Terminals_Export_Reports\\XCITE\\" + dateString + "_XCITE.xlsx");
                move("C:\\Cummins_Export_Files\\" + fileName, "C:\\Cummins_Export_Files\\" + dateString + "_XCITE.csv");
                res.contentType('application/json');
                res.send("C:\\Terminals_Export_Reports\\AMS\\" + dateString + "_AMS.xlsx");
            }, 5000);
        break;
        */
    }
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

/*
function readCSV(path){
    var terminals = [];
    csv
        .fromPath(path)
        .on("data", function(data){
            console.log("Data: " + data.FIELD1);
            data['_id'] = new mongoose.Types.ObjectId();

            terminals.push(data);
        })
        .on("end", function(){
            var jsonTotals = {vendor: "AMS", date: Date.now(), terminals: terminals};
            //Terminal.create(terminals);
            DayTotal.create(jsonTotals, function(err, documents) {
                if (err) throw err;
            });
            console.log("done");
        });
};
*/

function readCSV(filePath, fileHeaders, modelName) {
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
                    console.log("Sum for " + data[0] + ": " + sum);
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
                            //console.log('Saved ', data);
                        }
                    });
                });
        }
    })
}
