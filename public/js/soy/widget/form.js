// This file was automatically generated from form.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.widget == 'undefined') { soy.widget = {}; }


soy.widget.form = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<form action="', soy.$$escapeHtml(opt_data.action ? opt_data.action : ''), '" method="', soy.$$escapeHtml(opt_data.method ? opt_data.method : 'POST'), '">');
  if (opt_data.errors && opt_data.errors['global']) {
    output.append('<ul class="errors">');
    var errorList231 = opt_data.errors['global'];
    var errorListLen231 = errorList231.length;
    for (var errorIndex231 = 0; errorIndex231 < errorListLen231; errorIndex231++) {
      var errorData231 = errorList231[errorIndex231];
      output.append('<li>', soy.$$escapeHtml(errorData231), '</li>');
    }
    output.append('</ul>');
  }
  if (opt_data.fields) {
    var fieldList239 = opt_data.fields;
    var fieldListLen239 = fieldList239.length;
    for (var fieldIndex239 = 0; fieldIndex239 < fieldListLen239; fieldIndex239++) {
      var fieldData239 = fieldList239[fieldIndex239];
      soy.widget.form.field(soy.$$augmentData(fieldData239, {value: fieldData239.value ? fieldData239.value : opt_data.values ? opt_data.values[fieldData239.id] : null, errors: opt_data.errors ? opt_data.errors[fieldData239.id] : null}), output, opt_ijData);
    }
  }
  output.append((opt_data.fieldsHtml) ? opt_data.fieldsHtml : '', '<div class="buttons">', opt_data.buttonsHtml, '</div></form></div>');
  return opt_sb ? '' : output.toString();
};
