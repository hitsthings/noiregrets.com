var mongoose = require('mongoose');

var timeData = require('../data/time');

var mongoWrapper = require('./mongo-wrapper');

exports.CalendarValue = mongoWrapper(timeData.CalendarValue, {}, {});

exports.CalendarTimeOffset = mongoWrapper(timeData.TimeOffset, {}, {
    calendarValue : exports.CalendarValue
}, function() { this._mongo._type = "CalendarTimeOffset"; });

exports.AbsoluteTimeOffset = mongoWrapper(timeData.TimeOffset, {}, {
}, function() { this._mongo._type = "AbsoluteTimeOffset"; });

exports.TimeOffset = function TimeOffset() {};
exports.TimeOffset._fromMongo = function(mongo) {
    var ctor = mongo._type === 'CalendarTimeOffset' ?
            exports.CalendarTimeOffset :
            exports.AbsoluteTimeOffset;
    return ctor._fromMongo(mongo);
};
exports.TimeOffset._toMongo = function(thing) { return thing._mongo; };

exports.TimeOffset.prototype.__proto__ = exports.CalendarTimeOffset.prototype.__proto__;
exports.CalendarTimeOffset.prototype.__proto__ =
exports.AbsoluteTimeOffset.prototype.__proto__ =
    exports.TimeOffset.prototype;

exports.Time = function Time() {};
exports.Time._fromMongo= function(mongo) {
    var ctor = mongo._type === 'RelativeTime' ?
            exports.RelativeTime :
            exports.AbsoluteTime;
    return ctor._fromMongo(mongo);
};
exports.Time._toMongo = function(thing) { return thing._mongo; };

exports.AbsoluteTime = mongoWrapper(timeData.Time, {}, {
}, function() { this._mongo._type = "AbsoluteTime"; });

exports.RelativeTime = mongoWrapper(timeData.Time, {}, {
    anchor : exports.Time,
    offset : exports.TimeOffset
}, function() { this._mongo._type = "RelativeTime"; });

exports.Time.prototype.__proto__ = exports.AbsoluteTime.prototype.__proto__;
exports.RelativeTime.prototype.__proto__ =
exports.AbsoluteTime.prototype.__proto__ =
    exports.Time.prototype;

exports.TimeRange = mongoWrapper(timeData.TimeRange, {}, {
    startTime : exports.Time,
    endTime   : exports.Time
});