'use strict';

var fs = require('fs');
var path = require('path');

var mongoose = require('mongoose'),
    Task = mongoose.model('Tasks');

exports.list_all_tasks = function(req, res) {
    Task.find({}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


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
};

exports.processCSV = function(req, res) {
    var dateString = getDateString();
    var fileName = req.headers['file']
    console.log("FileName: " + fileName);
    console.log("Substring: " + fileName.substring(0,3).toLowerCase());
    //var Excel = win32ole.client.Dispatch('Excel.Application'); // locale
    //Excel.Visible = true;
    //Excel.Workbooks.Open("C:\\Cummins_Export_Files\\" + fileName);
    switch(fileName.substring(0,3).toLowerCase()) {
        case ams:
            console.log("Processing AMS");
            //Excel.Run("Personal.xlsb!TerminalsAMS");
            runMacro();
            setTimeout(function(){
                move("C:\\Cummins_Export_Files\\AMS_Export.xlsx", "C:\\Terminals_Export_Reports\\AMS\\" + dateString + "_AMS.xlsx");
                move("C:\\Cummins_Export_Files\\" + fileName, "C:\\Cummins_Export_Files\\" + dateString + "_AMS.csv");
                res.contentType('application/json');
                res.send("C:\\Terminals_Export_Reports\\AMS\\" + dateString + "_AMS.xlsx");
            }, 5000);
            break;
        case ame:
            console.log("Processing American");
            Excel.Run("Personal.xlsb!TerminalsAmerican");
            setTimeout(function(){
                move("C:\\Cummins_Export_Files\\AMERICAN_Export.xlsx", "C:\\Terminals_Export_Reports\\AMERICAN\\" + dateString + "_AMERICAN.xlsx");
                move("C:\\Cummins_Export_Files\\" + fileName, "C:\\Cummins_Export_Files\\" + dateString + "_AMERICAN.csv");
                res.contentType('application/json');
                res.send("C:\\Terminals_Export_Reports\\AMS\\" + dateString + "_AMS.xlsx");
            }, 5000);
            break;
        case win:
            console.log("Processing Winter Sky");
            Excel.Run("Personal.xlsb!TerminalsWinterSky");
            setTimeout(function(){
                move("C:\\Cummins_Export_Files\\AMS_Export.xlsx", "C:\\Terminals_Export_Reports\\WINTERSKY\\" + dateString + "_WINTERSKY.xlsx");
                move("C:\\Cummins_Export_Files\\" + fileName, "C:\\Cummins_Export_Files\\" + dateString + "_WINTERSKY.csv");
                res.contentType('application/json');
                res.send("C:\\Terminals_Export_Reports\\AMS\\" + dateString + "_AMS.xlsx");
            }, 5000);
            break;
        case xci:
            console.log("Processing Excite");
            Excel.Run("Personal.xlsb!TerminalsExcite");
            setTimeout(function(){
                move("C:\\Cummins_Export_Files\\AMS_Export.xlsx", "C:\\Terminals_Export_Reports\\XCITE\\" + dateString + "_XCITE.xlsx");
                move("C:\\Cummins_Export_Files\\" + fileName, "C:\\Cummins_Export_Files\\" + dateString + "_XCITE.csv");
                res.contentType('application/json');
                res.send("C:\\Terminals_Export_Reports\\AMS\\" + dateString + "_AMS.xlsx");
            }, 5000);
        break;
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

function move(oldPath, newPath, callback) {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
};