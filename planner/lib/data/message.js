var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

require('./message-template');

var MessageSchema = new Schema({
    template          : { type: ObjectId, ref: 'MessageTemplate', required: true },
    recipientEmail    : { type: String,                           required: true },
    subject           : { type: String,                           required: true },
    body              : { type: String,                           required: true },
    sendDate          : { type: Date,                             required: true }
});
exports.Message = mongoose.model('Message', MessageSchema);
