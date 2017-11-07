'use strict';

    .controller()('MyController', ['$scope', '$location', '$http', function ($scope, $location, $http) {
    $http({
        url: "http://localhost:3000/imports",
        method: "GET",
        headers: {"Content-type": "application/json"}
    }).then(function (response) {
        console.log("Worked!");
        console.log(response.data);
        $scope.files = response.data;
    });
    }]);

    /*
// Source: http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.

function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
        // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"), "\"");
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
}

function CSV2JSON(csv) {
    var array = CSVToArray(csv);
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]
        }
    }

    var json = JSON.stringify(objArray);
    var str = json.replace(/},/g, "},\r\n");

    return str;
}

function csvConvert() {
    var csv = document.getElementById('csv').value;
    console.log("CSV: " + csv);
    var json = CSV2JSON(csv);
    console.log("JSON: " + json);
    document.getElementById('json').value = json;
};

function downloadJSON(filename, json) {
    var element = document.createElement('a');
    element.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json)));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};

function downloadJSONClick() {
        var csv = document.getElementById('csv').value;
        var json = CSV2JSON(csv);
        var filename = "csvtoJSON.json";
        downloadJSON(filename, json);
};

function downloadCSVClick() {

    var CSVWhole = [
        '"1","val1","val2","val3","val4"',
        '"2","val1","val2","val3","val4"',
        '"3","val1","val2","val3","val4"'
    ].join('\n');

    var CSV = document.getElementById('csv').value;

    window.URL = window.webkitURL || window.URL;

    var contentType = 'text/csv';

    var csvFile = new Blob([CSV], {type: contentType});

    var a = document.createElement('a');
    a.download = 'my.csv';
    a.href = window.URL.createObjectURL(csvFile);
    a.textContent = 'Download CSV';

    a.dataset.downloadurl = [contentType, a.download, a.href].join(':');

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

function openCSVClick() {
    alert("AMS_Export.csv");
    var Excel = new ActiveXObject("Excel.Application");
    Excel.Workbooks.Open("C:\\Cummins_Export_Files\\AMS_Export.csv");
    Excel.Visible = true;
    Excel.Run("Personal.xlsb!TerminalsAMS");
};

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url, true);

    } else {
        // Otherwise, CORS is not supported by the browser.
        xhr = null;
    }
    return xhr;
}

// Make the actual CORS request.
function makeCorsRequest(method, url) {

    var xhr = createCORSRequest(method, url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }
    xhr.setRequestHeader('Content-Type', 'text/json');

    // Response handlers.
    xhr.onload = function() {
        var text = xhr.responseText;
        console.log("RESPONSE1: " + text);
    };

    xhr.onerror = function() {
        alert('Woops, there was an error making the request.');
    };

    //code before the pause
    setTimeout(function(){
        xhr.send();
    }, 2000);
    //code before the pause
    setTimeout(function(){
        console.log("RESPONSE3: " + xhr.responseText);
        document.getElementById('json').value = xhr.responseText;
    }, 2000);
}

function imports() {
    //var response = makeCorsRequest("GET", "http://ThomasPC:3000/imports");

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/imports", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    *
    setTimeout(function(){
        var response = xhttp.responseText;
        console.log("RESPONSE: " + response);
        document.getElementById('CumminsImportFiles').innerText = response;

    }, 2000);

    $http({
        url: "http://localhost:3000/imports",
        method: "GET",
        headers: {"Content-type", "application/json"}
    }).then(function (response) {
        //console.log("Worked!");
        //console.log(response.data);
        $scope.files = response.data;
    });

};
*/
