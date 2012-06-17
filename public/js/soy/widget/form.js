// This file was automatically generated from form.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.widget == 'undefined') { soy.widget = {}; }


soy.widget.form = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<form action="', soy.$$escapeHtml(opt_data.action ? opt_data.action : ''), '" method="', soy.$$escapeHtml(opt_data.method ? opt_data.method : 'POST'), '">');
  if (opt_data.errors && opt_data.errors['global']) {
    output.append('<ul class="errors">');
    var errorList216 = opt_data.errors['global'];
    var errorListLen216 = errorList216.length;
    for (var errorIndex216 = 0; errorIndex216 < errorListLen216; errorIndex216++) {
      var errorData216 = errorList216[errorIndex216];
      output.append('<li>', soy.$$escapeHtml(errorData216), '</li>');
    }
    output.append('</ul>');
  }
  if (opt_data.fields) {
    var fieldList224 = opt_data.fields;
    var fieldListLen224 = fieldList224.length;
    for (var fieldIndex224 = 0; fieldIndex224 < fieldListLen224; fieldIndex224++) {
      var fieldData224 = fieldList224[fieldIndex224];
      soy.widget.form.field(soy.$$augmentData(fieldData224, {value: fieldData224.value ? fieldData224.value : opt_data.values ? opt_data.values[fieldData224.id] : null, errors: opt_data.errors ? opt_data.errors[fieldData224.id] : null}), output, opt_ijData);
    }
  }
  output.append((opt_data.fieldsHtml) ? opt_data.fieldsHtml : '', '<div class="buttons">', opt_data.buttonsHtml, '</div></form></div>');
  return opt_sb ? '' : output.toString();
};
