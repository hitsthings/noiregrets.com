/** NOTE: This module is currently unused. **/

var mongoose = require('mongoose');
var promise = require('../../../promise');
var Schema = mongoose.Schema;

var FrequencySchema = new Schema({
    name : { type: String, required: true, unique : true },
    exceptionsAllowed : { type: Boolean, required: true },
    maxMax : { type: Number, required: true },
    minMax : { type: Number, required: true },
    absolute : { type: Boolean, required: true }
});
var Frequency = mongoose.model('Frequency', FrequencySchema);
function makeFrequency(val, allowsExceptionSchedule, maxMax, minMax, abs) {
    Frequency.findOne({ name : val }, function(err, freq) {
        if (err) {
            throw err;
        }
        if (!freq) {
            freq = new Frequency();
            freq.name = val;
        }
        
        freq.exceptionsAllowed = allowsExceptionSchedule;
        freq.maxMax = maxMax;
        freq.minMax = minMax || maxMax;
        freq.absolute = abs;

        freq.save(function(err, res) {
            if (err) {
                throw err;
            }
        });
    });
}

makeFrequency('ONCE', true, Infinity, Infinity, true);
makeFrequency('HOURLY', false, 60);
makeFrequency('DAILY', false, 60 * 24);
makeFrequency('WEEKLY', true, 60 * 24 * 7);
makeFrequency('MONTHLY', true, 60 * 24 * 31, 60 * 24 * 28);
makeFrequency('YEARLY', true, 60 * 24 * 366, 60 * 24 * 365);
promise.when().then(function() {
    Array.prototype.forEach.call(arguments, function(freqArg) {
        var freq = freqArg[0];
        Frequency[freq.name] = freq;
    });

}, function (err) { throw err; });
