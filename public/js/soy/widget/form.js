// This file was automatically generated from form.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.widget == 'undefined') { soy.widget = {}; }


soy.widget.form = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<form action="', soy.$$escapeHtml(opt_data.action ? opt_data.action : ''), '" method="', soy.$$escapeHtml(opt_data.method ? opt_data.method : 'POST'), '">');
  if (opt_data.errors && opt_data.errors['global']) {
    output.append('<ul class="errors">');
    var errorList249 = opt_data.errors['global'];
    var errorListLen249 = errorList249.length;
    for (var errorIndex249 = 0; errorIndex249 < errorListLen249; errorIndex249++) {
      var errorData249 = errorList249[errorIndex249];
      output.append('<li>', soy.$$escapeHtml(errorData249), '</li>');
    }
    output.append('</ul>');
  }
  if (opt_data.fields) {
    var fieldList257 = opt_data.fields;
    var fieldListLen257 = fieldList257.length;
    for (var fieldIndex257 = 0; fieldIndex257 < fieldListLen257; fieldIndex257++) {
      var fieldData257 = fieldList257[fieldIndex257];
      soy.widget.form.field(soy.$$augmentData(fieldData257, {value: fieldData257.value ? fieldData257.value : opt_data.values ? opt_data.values[fieldData257.id] : null, errors: opt_data.errors ? opt_data.errors[fieldData257.id] : null}), output, opt_ijData);
    }
  }
  output.append((opt_data.fieldsHtml) ? opt_data.fieldsHtml : '', '<div class="buttons">', opt_data.buttonsHtml, '</div></form></div>');
  return opt_sb ? '' : output.toString();
};
