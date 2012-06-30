/** NOTE: This module is currently unused. **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var PolymorphicSchema = require('./polymorphic');

var singletonList = require('./mongo-helper').singletonList;

/* Schemas */

var CalendarValueSchema = exports.CalendarValueSchema = new Schema({
    calendarType  : { type : String, 'enum' : [ 'hour', 'day', 'weekday', 'month', 'year' ], required: true },
    calendarIndex : { type : Number, required: true }
});


var AbsoluteTimeOffsetSchema = exports.AbsoluteTimeOffsetSchema = new Schema({
    millis : { type: Number, required: true }
});

var CalendarTimeOffsetSchema = exports.CalendarTimeOffsetSchema = new Schema({
    _calendarValue : [ CalendarValueSchema ],
    count          : { type: Number,              required: true }
});
singletonList(CalendarTimeOffsetSchema, '_calendarValue', 'calendarValue');

var TimeOffsetSchema = exports.TimeOffsetSchema = new PolymorphicSchema({
    AbsoluteTimeOffset : AbsoluteTimeOffsetSchema,
    CalendarTimeOffset : CalendarTimeOffsetSchema
});


var AbsoluteTimeSchema = exports.AbsoluteTimeSchema = new Schema({
    epochMillis : { type: Number, required: true }
});

var RelativeTimeSchema = exports.RelativeTimeSchema = new Schema({
    _offset : [ TimeOffsetSchema ]
});
singletonList(RelativeTimeSchema, '_offset', 'offset');

var TimeSchema = exports.TimeSchema = new PolymorphicSchema({
    AbsoluteTime : AbsoluteTimeSchema,
    RelativeTime : RelativeTimeSchema
});

RelativeTimeSchema.add({ _anchor : [ TimeSchema ] });
singletonList(RelativeTimeSchema, '_anchor', 'anchor');

var TimeRangeSchema = exports.TimeRangeSchema = new Schema({
    _startTime : [ TimeSchema ],
    _endTime   : [ TimeSchema ]
});
singletonList(TimeRangeSchema, '_startTime', 'startTime');
singletonList(TimeRangeSchema, '_endTime', 'endTime');

/* Models */

var CalendarValue = exports.CalendarValue =
        mongoose.model('CalendarValue', CalendarValueSchema);

var AbsoluteTimeOffset = exports.AbsoluteTimeOffset =
        mongoose.model('AbsoluteTimeOffset', AbsoluteTimeOffsetSchema);

var CalendarTimeOffset = exports.CalendarTimeOffset =
        mongoose.model('CalendarTimeOffset', CalendarTimeOffsetSchema);

exports.TimeOffset =
        mongoose.model('TimeOffset', TimeOffsetSchema);


var AbsoluteTime = exports.AbsoluteTime =
        mongoose.model('AbsoluteTime', AbsoluteTimeSchema);

var RelativeTime = exports.RelativeTime =
        mongoose.model('RelativeTime', RelativeTimeSchema);

exports.Time =
        mongoose.model('Time', TimeSchema);


var TimeRange = exports.TimeRange =
        mongoose.model('TimeRange', TimeRangeSchema);