// This file was automatically generated from planner.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }


soy.planner = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('Avoiding error. Forget what I was doing here.');
  return opt_sb ? '' : output.toString();
};


soy.occurrence = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  return opt_sb ? '' : output.toString();
};


soy.createPlanForm = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<form method="post" action="" id="create_form"><ul class="occurrences"><li><fieldset><legend>Occurrence</legend><label for="new_occurrence_type_abs">On a specific day and time:</label><input id="new_occurrence_type_abs" type="radio" name="new_occurrence_type" value="AbsoluteTime" /><input id="new_occurrence_datetime" type="datetime" name="new_occurrence_datetime" value="" /><input id="new_occurrence_type_rel" type="radio" name="new_occurrence_type" value="RelativeTime" /><label for="new_occurrence_type_rel">The <select name="new_occurrence_rel_ordinal"><option value="1">next</option><option value="2">2nd</option><option value="3">3rd</option><option value="4">4th</option><option value="5">5th</option><option value="6">6th</option><option value="7">7th</option><option value="8">8th</option><option value="9">9th</option><option value="-1">last</option><option value="-2">2nd last</option><option value="-3">3rd last</option></select> <select name="new_occurence_unit">');
  var calendarTypeList30 = opt_data.calendarTypes;
  var calendarTypeListLen30 = calendarTypeList30.length;
  for (var calendarTypeIndex30 = 0; calendarTypeIndex30 < calendarTypeListLen30; calendarTypeIndex30++) {
    var calendarTypeData30 = calendarTypeList30[calendarTypeIndex30];
    output.append('<optgroup value="', soy.$$escapeHtml(calendarTypeData30.value), '">', soy.$$escapeHtml(calendarTypeData30.displayName), '</optgroup>');
    var calendarValueList36 = opt_data.calendarValuesByType[calendarTypeData30.value];
    var calendarValueListLen36 = calendarValueList36.length;
    for (var calendarValueIndex36 = 0; calendarValueIndex36 < calendarValueListLen36; calendarValueIndex36++) {
      var calendarValueData36 = calendarValueList36[calendarValueIndex36];
      output.append('<option value="', soy.$$escapeHtml(calendarTypeData30.value), '"></option>');
    }
  }
  output.append('</select> since the last occurrence.</label></fieldset></li></ul><ul class="recurrences"><li><fieldset><legend>Recurrence</legend>Repeat every</fieldset></li></ul><div class="field"><label for="plan_name">Subject</label><input type="text" name="plan_name" id="plan_name" /></div><div class="field"><label for="email_subject">Subject</label><input type="text" name="subject" id="email_subject" /></div><div class="field"><label for="email_body">Body</label><textarea name="body" id="email_body" /></div><div class="field"><label for="frequency">Frequency</label><select id="frequency" name="frequency"><option value="ONCE" selected>Once</option><option value="HOURLY">Hourly</option><option value="DAILY">Daily</option><option value="WEEKLY">Weekly</option><option value="MONTHLY">Monthly</option><option value="YEARLY">Yearly</option></select></div><div id="once_fields"><div class="field"><label for="once_start">Sometime after</label><input type="text" class="timepicker" id="once_start" name="once_start" /></div><div class="field"><label for="once_end">But before</label><input type="text" class="timepicker" id="once_end" name="once_end" /></div></div><div class="actions"><input type="submit" value="Create Plan" name="create_plan" /><a class="cancel">Cancel</a></div></form>\n\t<script>\n\t\t$(\'.timepicker\').datetimepicker();\n\t\n\t\tdocument.getElementById(\'create_form\').addEventListener(\'submit\', function(e) {\n\t\t\tvar planner = require(\'planner\');\n\t\t\n\t\t\tvar planName = document.getElementById(\'plan_name\').value,\n\t\t\t\tsubject = document.getElementById(\'email_subject\').value,\n\t\t\t\tbody = document.getElementById(\'email_body\').value;\n\t\t\t\t\n\t\t\tvar start = new Date(document.getElementById(\'once_start\').value),\n\t\t\t\tend = new Date(document.getElementById(\'once_end\').value);\n\t\t\t\t\n\t\t\tplanner.createPlan(planName, planner.Email.create(subject, body),\n\t\t\t\tFrequency.ONCE.getScheduleBuilder().addTimespan(start, end).build())\n\t\t\t\n\t\t\te.preventDefault();\n\t\t});\n\t<\/script>\n\t');
  return opt_sb ? '' : output.toString();
};


soy.onceOptions = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<div class="field"><label for="', soy.$$escapeHtml(opt_data.parentNs), '_start_date">Sent after</label><input type="text" id="', soy.$$escapeHtml(opt_data.parentNs), '_start_date" name="', soy.$$escapeHtml(opt_data.parentNs), '_start_date" /></div><div class="field">But <label for="', soy.$$escapeHtml(opt_data.parentNs), '_end_date">sent before</label><input type="text" id="', soy.$$escapeHtml(opt_data.parentNs), '_end_date" name="', soy.$$escapeHtml(opt_data.parentNs), '_end_date" /></div>');
  return opt_sb ? '' : output.toString();
};
