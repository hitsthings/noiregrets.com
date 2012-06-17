/*
 WARNING: This file shouldn't be committed to a public repo with real data.
 	It currently contains dev-environment data, and real data is available only on the webserver.
*/

exports.mail_username = "example@gmail.com";
exports.mail_password = "password";
exports.mail_fromAddress = "example@gmail.com";

exports.secret = "not so secret";

exports.domain = "localhost";
exports.port   = "3000";
exports.schema = "http";

exports.recaptcha = {
	privateKey : '6Lc95dISAAAAAOTPOTHsm9hfPoIP7dm38spxyhwT',
	publicKey : '6Lc95dISAAAAABAVsibfmw27WOn0wn7g8-vpiUg6'
};
