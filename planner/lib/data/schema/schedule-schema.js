var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TimeSchema = require('./time-schema').TimeSchema;
var RecurrenceSchema = require('./recurrence-schema');

module.exports = new Schema({
    occurrences : [ TimeSchema ],
    recurrences : [ RecurrenceSchema ]
});