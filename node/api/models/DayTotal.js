'use strict';

var mongoose = require('mongoose');

/*
var TaskSchema = new Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the task'
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ['pending', 'ongoing', 'completed']
        }],
        default: ['pending']
    }
});

module.exports = mongoose.model('Tasks', TaskSchema);
*/

function getDateString() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    console.log("Date String: " + year + "_" + month + "_" + day);
    return(year + "_" + month + "_" + day);
};

var DayTotalSchema =  mongoose.Schema ({
    vendor: {
        type: String,
        default: '',
        trim: true
    },
    date: {
        type: String,
        default: getDateString(),
        trim: true
    },
    grand_total: {
        type: Number,
        default: 0,
        trim: true
    },
    terminals: [{
        terminal: {
            type: Number,
            default: 0,
            trim: true
        },
        ones: {
            type: Number,
            default: 0,
            trim: true
        },
        fives: {
            type: Number,
            default: 0,
            trim: true
        },
        tens: {
            type: Number,
            default: 0,
            trim: true
        },
        twenties: {
            type: Number,
            default: 0,
            trim: true
        },
        fifties: {
            type: Number,
            default: 0,
            trim: true
        },
        hundreds: {
            type: Number,
            default: 0,
            trim: true
        },
        total: {
            type: Number,
            default: 0,
            trim: true
        }
    }]
});

var TerminalSchema =  mongoose.Schema ({
    daytotal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DayTotal'
    },
    terminal: {
        type: Number,
        default: 0,
        trim: true
    },
    ones: {
        type: Number,
        default: 0,
        trim: true
    },
    fives: {
        type: Number,
        default: 0,
        trim: true
    },
    tens: {
        type: Number,
        default: 0,
        trim: true
    },
    twenties: {
        type: Number,
        default: 0,
        trim: true
    },
    fifties: {
        type: Number,
        default: 0,
        trim: true
    },
    hundreds: {
        type: Number,
        default: 0,
        trim: true
    }
});

var DayTotal = mongoose.model('DayTotal', DayTotalSchema);
var Terminal = mongoose.model('Terminal', TerminalSchema);

module.exports = DayTotal;