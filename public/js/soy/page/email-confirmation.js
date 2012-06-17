// This file was automatically generated from email-confirmation.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.emailConfirmation = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<h1>', soy.$$escapeHtml(opt_data.succeeded ? 'Email verified' : 'Email NOT verified'), '</h1>', (opt_data.reason) ? '<p>' + soy.$$escapeHtml(opt_data.reason) + ((opt_data.showSignup) ? ' Did you want to <a href="/signup">Sign up</a>?' : '') + '</p>' : (opt_data.succeeded) ? '<p>You can now use the address \'' + soy.$$escapeHtml(opt_data.email) + '\' with any of the apps.</p>' : '');
  return opt_sb ? '' : output.toString();
};
