var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var singletonList = require('./mongo-helper').singletonList;

var TimeOffsetSchema = require('./time-schema').TimeOffsetSchema;

var RecurrenceSchema = new Schema({
    _offset : [ TimeOffsetSchema ],
    limit : { type: Number, 'default': -1 }
});
singletonList(RecurrenceSchema, '_offset', 'offset');

module.exports = RecurrenceSchema;