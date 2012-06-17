var mongoose = require('mongoose');

var RecurrenceData = require('../data/recurrence');

var TimeOffset = require('./time').TimeOffset;

var mongoWrapper = require('./mongo-wrapper');

module.exports = mongoWrapper(RecurrenceData, {}, {
    offset : TimeOffset
});