var mongoose = require('mongoose');

var mongoWrapper = require('./mongo-wrapper');

module.exports = mongoWrapper(require('../data/message'), {}, {
    template : require('./message-template')
});