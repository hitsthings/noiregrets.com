var mongoose = require('mongoose');

module.exports = mongoose.model('MessageTemplate', require('./schema/message-template-schema'));
