// This file was automatically generated from plan.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.feature == 'undefined') { soy.feature = {}; }


soy.feature.plan = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<article class="plan', (! opt_data.expanded) ? ' collapsed' : '', '"><header><h1>', soy.$$escapeHtml(opt_data.taskSummary), '</h1></header><section class="schedule" data-json="', soy.$$escapeHtml(opt_data.scheduleJSON), '">', soy.$$escapeHtml(opt_data.scheduleDescription), '</section><section class="message">', soy.$$escapeHtml(opt_data.taskDescription), '</section></article>');
  return opt_sb ? '' : output.toString();
};
