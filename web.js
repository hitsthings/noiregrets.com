var noiregrets = require('./lib/noiregrets.com');

var mongoose = require('mongoose');

var hasher = require('./hasher');

var privateConf = require('./private_conf');
var conf = require('./lib/conf');

function setupDB(done) {
    console.log('Connecting MongoDB...');
    mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/test', function(err) {
        if (err) {
            new (require('events').EventEmitter)().emit('error', err);
        } else {
            console.log('MongoDB connected.');
            done();
        }
    });    
}

hasher.secret = privateConf.secret;

conf.defaults.schema = privateConf.schema;
conf.defaults.domain = privateConf.domain;
conf.defaults.port = privateConf.port;
conf.defaults.mail.transport.auth.user = privateConf.mail_username;
conf.defaults.mail.transport.auth.pass = privateConf.mail_password;
conf.defaults.mail.fromAddress         = privateConf.fromAddress;

setupDB(function() {
    console.log('Configuring NoirEgrets app...');
    noiregrets.createApp(function(err, app) {
        if (err) {
            console.error(err);
            return;
        }

        console.log('NoirEgrets app configured.');

        var port = process.env.PORT || 3000;
        app.listen(port, function() {
          console.log("Listening on " + port);
        });
    });

});
