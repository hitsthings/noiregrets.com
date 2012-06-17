var Mailer = {
    sendVerification : function() {
        return $.ajax('/mailer/resend-verification');
    }
};