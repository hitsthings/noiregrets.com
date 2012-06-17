var emitter = new (require('events').EventEmitter)();

var bus = module.exports = {};

function addType(type) {
    bus['on' + type] = function() {
        Array.prototype.unshift.call(arguments, type);
        emitter.on.apply(emitter, arguments);
    };
    bus['emit' + type] = function() {
        Array.prototype.unshift.call(arguments, type);
        emitter.emit.apply(emitter, arguments);
    };
}

addType('UserAdded');
addType('EmailVerificationRequested');