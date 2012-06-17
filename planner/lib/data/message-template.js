var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

require('./schedule');
require('../../../lib/model/user');

var MessageTemplateSchema = new Schema({
    author            : { type: ObjectId, ref: 'User',     required: true },
    schedule          : { type: ObjectId, ref: 'Schedule', required: true },
    subjectTemplate   : { type: String,                    required: true },
    bodyTemplate      : { type: String,                    required: true },
    nextSendDate      : { type: Date, sparse: true },
});
exports.MessageTemplate = mongoose.model('MessageTemplate', MessageTemplateSchema);
