// This file was automatically generated from profile.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.profile = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\n    <style>\n        #edit-email {\n            display: inline-block;\n            padding-left: 1em;\n        }\n    </style>\n    <div class="form-layout profile"><h1>Profile</h1>');
  soy.widget.form({errors: opt_data.errors, fields: [{'id': 'username', 'labelText': 'Username', 'type': 'value', 'value': opt_data.username}, {'id': 'email', 'labelText': 'Email', 'type': 'value', 'value': opt_data.email, 'valuePlaceholderHtml': '<a href="#" id="edit-email">' + (opt_data.email ? 'Change it?' : 'Add one?') + '</a>'}], buttonsHtml: '<input type="submit" id="update-profile" class="hidden" value="Update" />'}, output, opt_ijData);
  output.append('</div>\n    <script>\n        if (document.getElementById(\'edit-email\')) {\n            document.getElementById(\'edit-email\').onclick = function (e) {\n                e = e || window.event;\n\n                e.target.parentNode.className += " invisible";\n\n                var input = document.createElement(\'input\');\n                input.type = \'email\';\n                input.name = \'email\';\n\n                var valNode = document.getElementById(\'email\');\n                input.value = valNode.childNodes[0].data;\n\n                valNode.parentNode.insertBefore(input, valNode);\n                valNode.parentNode.removeChild(valNode);\n\n                document.getElementById(\'update-profile\').className = \'\';\n\n                input.focus();\n                input.select();\n\n                e.preventDefault && e.preventDefault();\n                return false;\n            };\n        }\n    <\/script>\n    ');
  return opt_sb ? '' : output.toString();
};
