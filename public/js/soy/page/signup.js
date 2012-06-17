// This file was automatically generated from signup.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.signup = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="form-layout">');
  soy.widget.form({errors: opt_data.errors, values: opt_data.values, fields: [{'id': 'username', 'labelText': 'Username', 'type': 'text', 'isRequired': true, 'autofocus': true}, {'id': 'password', 'labelText': 'Password', 'type': 'password', 'isRequired': true}, {'id': 'email', 'labelText': 'Email', 'type': 'email', 'isRequired': false}], buttonsHtml: '<input type="submit" value="Sign up" />'}, output, opt_ijData);
  output.append('</div>');
  return opt_sb ? '' : output.toString();
};
