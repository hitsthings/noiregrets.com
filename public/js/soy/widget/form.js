// This file was automatically generated from form.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.widget == 'undefined') { soy.widget = {}; }


soy.widget.form = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<form action="', soy.$$escapeHtml(opt_data.action ? opt_data.action : ''), '" method="', soy.$$escapeHtml(opt_data.method ? opt_data.method : 'POST'), '">');
  if (opt_data.errors && opt_data.errors['global']) {
    output.append('<ul class="errors">');
    var errorList263 = opt_data.errors['global'];
    var errorListLen263 = errorList263.length;
    for (var errorIndex263 = 0; errorIndex263 < errorListLen263; errorIndex263++) {
      var errorData263 = errorList263[errorIndex263];
      output.append('<li>', soy.$$escapeHtml(errorData263), '</li>');
    }
    output.append('</ul>');
  }
  if (opt_data.fields) {
    var fieldList271 = opt_data.fields;
    var fieldListLen271 = fieldList271.length;
    for (var fieldIndex271 = 0; fieldIndex271 < fieldListLen271; fieldIndex271++) {
      var fieldData271 = fieldList271[fieldIndex271];
      soy.widget.form.field(soy.$$augmentData(fieldData271, {value: fieldData271.value ? fieldData271.value : opt_data.values ? opt_data.values[fieldData271.id] : null, errors: opt_data.errors ? opt_data.errors[fieldData271.id] : null}), output, opt_ijData);
    }
  }
  output.append((opt_data.fieldsHtml) ? opt_data.fieldsHtml : '', '<div class="buttons">', opt_data.buttonsHtml, '</div></form></div>');
  return opt_sb ? '' : output.toString();
};
