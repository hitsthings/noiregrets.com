// This file was automatically generated from planner.soy.
// Please don't edit this file by hand.

if (typeof noiregrets == 'undefined') { var noiregrets = {}; }
if (typeof noiregrets.planner == 'undefined') { noiregrets.planner = {}; }


noiregrets.planner.createPlanForm = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<form method="post" action="" id="create_form"><div class="field"><label for="plan_name">Subject</label><input type="text" name="plan_name" id="plan_name" /></div><div class="field"><label for="email_subject">Subject</label><input type="text" name="subject" id="email_subject" /></div><div class="field"><label for="email_body">Body</label><textarea name="body" id="email_body" /></div><div class="field"><label for="frequency">Frequency</label><select id="frequency" name="frequency"><option value="ONCE" selected>Once</option><option value="HOURLY">Hourly</option><option value="DAILY">Daily</option><option value="WEEKLY">Weekly</option><option value="MONTHLY">Monthly</option><option value="YEARLY">Yearly</option></select></div><div id="once_fields"><div class="field"><label for="once_start">Sometime after</label><input type="text" class="timepicker" id="once_start" name="once_start" /></div><div class="field"><label for="once_end">But before</label><input type="text" class="timepicker" id="once_end" name="once_end" /></div></div><div class="actions"><input type="submit" value="Create Plan" name="create_plan" /><a class="cancel">Cancel</a></div></form>\n\t<script>\n\t\t$(\'.timepicker\').datetimepicker();\n\t\n\t\tdocument.getElementById(\'create_form\').addEventListener(\'submit\', function(e) {\n\t\t\tvar planner = require(\'planner\');\n\t\t\n\t\t\tvar planName = document.getElementById(\'plan_name\').value,\n\t\t\t\tsubject = document.getElementById(\'email_subject\').value,\n\t\t\t\tbody = document.getElementById(\'email_body\').value;\n\t\t\t\t\n\t\t\tvar start = new Date(document.getElementById(\'once_start\').value),\n\t\t\t\tend = new Date(document.getElementById(\'once_end\').value);\n\t\t\t\t\n\t\t\tplanner.createPlan(planName, planner.Email.create(subject, body),\n\t\t\t\tFrequency.ONCE.getScheduleBuilder().addTimespan(start, end).build())\n\t\t\t\n\t\t\te.preventDefault();\n\t\t});\n\t<\/script>\n\t');
  return opt_sb ? '' : output.toString();
};


noiregrets.planner.onceOptions = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<div class="field"><label for="', soy.$$escapeHtml(opt_data.parentNs), '_start_date">Sent after</label><input type="text" id="', soy.$$escapeHtml(opt_data.parentNs), '_start_date" name="', soy.$$escapeHtml(opt_data.parentNs), '_start_date" /></div><div class="field">But <label for="', soy.$$escapeHtml(opt_data.parentNs), '_end_date">sent before</label><input type="text" id="', soy.$$escapeHtml(opt_data.parentNs), '_end_date" name="', soy.$$escapeHtml(opt_data.parentNs), '_end_date" /></div>');
  return opt_sb ? '' : output.toString();
};
