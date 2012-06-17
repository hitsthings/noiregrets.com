var eventBus = require('./event-bus');

var path = require('path');

var nodemailer = require('nodemailer');

var transport;

var config, mailConfig;
function setConfiguration(newConfig) {
    config = newConfig;
    mailConfig = config.mail;

    if (transport) {
        transport.close();
    }

    transport = nodemailer.createTransport("SMTP", mailConfig.transport);
}

function sendConfirmationEmail(emailAddress, passcode, callback) {
    var attemptsLeft = mailConfig.numAttempts || 1,
        confirmationUrl = config.schema + '://' + config.domain + (config.port ? ':' + config.port : '') +
                            path.join(config.basePath, 'email-confirm', passcode).replace(/\\/g,'/') +
                            "?email=" + encodeURIComponent(emailAddress);
    
    function send() {
        transport.sendMail({
            from: mailConfig.fromAddress,
            to: emailAddress,
            subject:'Your new account at NoirEgrets.com',
            html: ['<p>',
                    'Click <b><a href="' + confirmationUrl + '">here</a></b> to verify your email ',
                    'address, or visit:',
                '</p><p>',
                    '<a href="' + confirmationUrl + '">' + confirmationUrl + '</a>',
                '</p>'].join(''),
            text: 'Please go to ' + confirmationUrl + ' to verify your email address.'
        }, function(error, response) {
            callback = callback || function() {};
            if (error) {
                callback(error);
            } else if (response) {
                callback(null, response);
            } else if (--attemptsLeft) {
                send();
            } else {
                callback(new Error(
                    'No error, but did not successfully send confirmation mail to ' + emailAddress +
                    ' despite ' + (mailConfig.numAttempts || 1) + ' attempts.'));
            }
        });
    }
    
    send();
}

var sendVerificationHandler = function(user) {
    var email = user.get('email');
    if (email) {
        sendConfirmationEmail(email, user.get('emailConfirmationHash'), function(err,response) {
            if (err) {
                console.log('Error sending mail:');
                console.dir(err);
            } else if (response && response.failedRecipients && response.failedRecipients.length) {
                console.log('Failed to send mail to: ' + response.failedRecipients.join(', '));
                console.log('Server response was: ' + response.message);
            }
        });
    }
};

eventBus.onUserAdded(sendVerificationHandler);

eventBus.onEmailVerificationRequested(sendVerificationHandler);

exports.setConfiguration = setConfiguration;
