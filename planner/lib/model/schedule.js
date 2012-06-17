var mongoose = require('mongoose');

var ScheduleData = require('../data/schedule');

var Recurrence = require('./recurrence');
var Time = require('./time').Time;

var mongoWrapper = require('./mongo-wrapper');

module.exports = mongoWrapper(ScheduleData, {}, {
    recurrences : Recurrence,
    occurrences : Time
});