var mongoose = require('mongoose');
var timeSchema = require('./schema/time-schema');

/* Models */

var CalendarValue = exports.CalendarValue =
        mongoose.model('CalendarValue', timeSchema.CalendarValueSchema);

var TimeOffset = exports.TimeOffset =
        mongoose.model('TimeOffset', timeSchema.TimeOffsetSchema);

var Time = exports.Time =
        mongoose.model('Time', timeSchema.TimeSchema);

var TimeRange = exports.TimeRange =
        mongoose.model('TimeRange', timeSchema.TimeRangeSchema);