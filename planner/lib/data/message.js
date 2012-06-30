var mongoose = require('mongoose');

module.exports = mongoose.model('Message', require('./schema/message-schema'));
