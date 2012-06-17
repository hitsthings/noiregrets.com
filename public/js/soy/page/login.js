// This file was automatically generated from login.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.login = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="form-layout">');
  soy.widget.form({errors: opt_data.errors, values: opt_data.values, fields: [{'id': 'username', 'labelText': 'Username', 'type': 'text', 'isRequired': true, 'autofocus': true}, {'id': 'password', 'labelText': 'Password', 'type': 'password', 'isRequired': true}], fieldsHtml: (opt_data.next) ? '<input type="hidden" name="next" value="' + soy.$$escapeHtml(opt_data.next) + '" />' : '', buttonsHtml: '<a href="/signup">Sign up</a><input type="submit" value="Log in" />'}, output, opt_ijData);
  output.append('</div>');
  return opt_sb ? '' : output.toString();
};
