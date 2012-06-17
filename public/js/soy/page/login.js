// This file was automatically generated from login.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.login = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="form-layout">');
  soy.widget.form({errors: opt_data.errors, values: opt_data.values, fields: [{'id': 'username', 'labelText': 'Username', 'type': 'text', 'isRequired': true, 'autofocus': true}, {'id': 'password', 'labelText': 'Password', 'type': 'password', 'isRequired': true}], fieldsHtml: ((opt_data.next) ? '<input type="hidden" name="next" value="' + soy.$$escapeHtml(opt_data.next) + '" />' : '') + ((opt_data.showCaptcha) ? '<script type="text/javascript" src="http://www.google.com/recaptcha/api/challenge?k=' + soy.$$escapeHtml(opt_data.recaptchaKey) + ((opt_data.captchaError) ? '&amp;error=' + soy.$$escapeHtml(opt_data.captchaError) : '') + '"><\/script><noscript><iframe src="http://www.google.com/recaptcha/api/noscript?k=' + soy.$$escapeHtml(opt_data.recaptchaKey) + ((opt_data.captchaError) ? '&amp;error=' + soy.$$escapeHtml(opt_data.captchaError) : '') + '" height="300" width="500" frameborder="0"></iframe><br /><textarea name="recaptcha_challenge_field" rows="3" cols="40"></textarea><input type="hidden" name="recaptcha_response_field" value="manual_challenge" /></noscript>' : ''), buttonsHtml: '<a href="/signup">Sign up</a><input type="submit" value="Log in" />'}, output, opt_ijData);
  output.append('</div>');
  return opt_sb ? '' : output.toString();
};
