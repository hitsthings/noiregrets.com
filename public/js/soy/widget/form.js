// This file was automatically generated from form.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.widget == 'undefined') { soy.widget = {}; }


soy.widget.form = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<form action="', soy.$$escapeHtml(opt_data.action ? opt_data.action : ''), '" method="', soy.$$escapeHtml(opt_data.method ? opt_data.method : 'POST'), '">');
  if (opt_data.errors && opt_data.errors['global']) {
    output.append('<ul class="errors">');
    var errorList257 = opt_data.errors['global'];
    var errorListLen257 = errorList257.length;
    for (var errorIndex257 = 0; errorIndex257 < errorListLen257; errorIndex257++) {
      var errorData257 = errorList257[errorIndex257];
      output.append('<li>', soy.$$escapeHtml(errorData257), '</li>');
    }
    output.append('</ul>');
  }
  if (opt_data.fields) {
    var fieldList265 = opt_data.fields;
    var fieldListLen265 = fieldList265.length;
    for (var fieldIndex265 = 0; fieldIndex265 < fieldListLen265; fieldIndex265++) {
      var fieldData265 = fieldList265[fieldIndex265];
      soy.widget.form.field(soy.$$augmentData(fieldData265, {value: fieldData265.value ? fieldData265.value : opt_data.values ? opt_data.values[fieldData265.id] : null, errors: opt_data.errors ? opt_data.errors[fieldData265.id] : null}), output, opt_ijData);
    }
  }
  output.append((opt_data.fieldsHtml) ? opt_data.fieldsHtml : '', '<div class="buttons">', opt_data.buttonsHtml, '</div></form></div>');
  return opt_sb ? '' : output.toString();
};
