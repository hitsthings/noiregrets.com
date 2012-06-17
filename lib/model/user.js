var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hasher = require('../../hasher');

var emailRegex = /^([A-Z0-9\._%\+\-]+@[A-Z0-9\.\-]+\.[A-Z]{2,4})?$/i;

var UserSchema = new Schema({
    username          : { type: String, unique: true, required: true},
    passwordHash      : { type: String,               required: true},
    email             : { type: String, unique: true, sparse: true, validate : [ emailRegex, "That is not a valid email address." ] },
    emailConfirmed    : { type: Boolean, 'default': false },
    admin             : { type: Boolean, 'default': false }
});

UserSchema.methods.validPassword = function (password) {
    return hasher.generateHash(password) === this.passwordHash;
};

UserSchema.virtual('password').set(function(str) {
    this.set('passwordHash', hasher.generateHash(str));
});

UserSchema.virtual('emailConfirmationHash').get(function() {
    return hasher.generateHash(this.get('email'));
});

module.exports = mongoose.model('User', UserSchema);