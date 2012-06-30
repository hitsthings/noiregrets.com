var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var singletonList = require('./mongo-helper').singletonList;

/* Schemas */

var CalendarValueSchema = exports.CalendarValueSchema = new Schema({
    calendarType  : { type : String, 'enum' : [ 'hour', 'day', 'weekday', 'month', 'year' ], required: true },
    calendarIndex : { type : Number, required: true }
});

var TimeOffsetSchema = exports.TimeOffsetSchema = new Schema({
    _type : {type : String, 'enum': [ 'CalendarTimeOffset', 'AbsoluteTimeOffset' ], required: true},
    millis : { type: Number },
    _calendarValue : [ CalendarValueSchema ],
    count          : { type: Number }
});
singletonList(TimeOffsetSchema, '_calendarValue', 'calendarValue');
TimeOffsetSchema.path('_type').validate(function(type, fn) {
    switch(type) {
        case 'AbsoluteTimeOffset':
            return fn(this.millis != null);
        case 'CalendarTimeOffset':
            return fn(this._calendarValue.length && this.count != null);
        default:
            return fn(false);
    }
}, '_type');


var TimeSchema = exports.TimeSchema = new Schema({
    _type : {type : String, 'enum': [ 'RelativeTime', 'AbsoluteTime' ], required: true},
    epochMillis : { type: Number },
    _offset : [ TimeOffsetSchema ]
});
TimeSchema.add({
    _anchor : [ TimeSchema ]
});
singletonList(TimeSchema, '_anchor', 'anchor');
singletonList(TimeSchema, '_offset', 'offset');

TimeSchema.path('_type').validate(function(type, fn) {
    switch(type) {
        case 'AbsoluteTime':
            return fn(this.epochMillis != null);
        case 'RelativeTime':
            return fn(this._anchor.length && this._offset.length);
        default:
            return fn(false);
    }
}, '_type');

var TimeRangeSchema = exports.TimeRangeSchema = new Schema({
    _startTime : [ TimeSchema ],
    _endTime   : [ TimeSchema ]
});
singletonList(TimeRangeSchema, '_startTime', 'startTime');
singletonList(TimeRangeSchema, '_endTime', 'endTime');