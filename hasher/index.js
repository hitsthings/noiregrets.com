var crypto = require('crypto');

exports.secret = 'need to move this out of the code so its private';
exports.generateHash = function(data, opt_secret) {
    var cipher = crypto.createCipher('blowfish', opt_secret || exports.secret),
        hasher = crypto.createHash('md5');
    
    hasher.update(cipher.update(data, 'utf8', 'base64'));
    hasher.update(cipher.final());
    return hasher.digest('hex');
};