// This file was automatically generated from field.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.widget == 'undefined') { soy.widget = {}; }
if (typeof soy.widget.form == 'undefined') { soy.widget.form = {}; }


soy.widget.form.field = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="field', (opt_data.fieldClass) ? ' ' + soy.$$escapeHtml(opt_data.fieldClass) : '', '"><label for="', soy.$$escapeHtml(opt_data.id), '" ', (opt_data.isRequired) ? 'class="required"' : '', '>', soy.$$escapeHtml(opt_data.labelText), '</label>');
  switch (opt_data.type) {
    case 'value':
      output.append('<span id="', soy.$$escapeHtml(opt_data.id), '" class="value', (! opt_data.value) ? ' empty' : '', '">', (opt_data.value) ? soy.$$escapeHtml(opt_data.value) : '', (opt_data.valuePlaceholder) ? soy.$$escapeHtml(opt_data.valuePlaceholder) : '', (opt_data.valuePlaceholderHtml) ? opt_data.valuePlaceholderHtml : '', '</span>');
      break;
    default:
      output.append('<input id="', soy.$$escapeHtml(opt_data.id), '" name="', soy.$$escapeHtml(opt_data.id), '" type="', soy.$$escapeHtml(opt_data.type), '"', (opt_data.value) ? ' value="' + soy.$$escapeHtml(opt_data.value) + '"' : '', (opt_data.valuePlaceholder) ? ' placeholder="' + soy.$$escapeHtml(opt_data.valuePlaceholder) + '"' : '', (opt_data.autofocus) ? ' autofocus' : '', (opt_data.isDisabled) ? ' disabled' : '', (opt_data.isReadOnly) ? ' readonly' : '', ' />');
  }
  output.append((opt_data.note || opt_data.noteHtml) ? '<span class="note">' + soy.$$escapeHtml(opt_data.note ? opt_data.note : '') + (opt_data.noteHtml ? opt_data.noteHtml : '') + '</span>' : '');
  if (opt_data.errors) {
    output.append('<ul class="errors">');
    var errorList246 = opt_data.errors;
    var errorListLen246 = errorList246.length;
    for (var errorIndex246 = 0; errorIndex246 < errorListLen246; errorIndex246++) {
      var errorData246 = errorList246[errorIndex246];
      output.append('<li>', soy.$$escapeHtml(errorData246), '</li>');
    }
    output.append('</ul>');
  }
  output.append('</div>');
  return opt_sb ? '' : output.toString();
};
