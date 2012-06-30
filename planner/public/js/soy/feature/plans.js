// This file was automatically generated from plans.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.feature == 'undefined') { soy.feature = {}; }


soy.feature.plans = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  var planList18 = opt_data.plans;
  var planListLen18 = planList18.length;
  for (var planIndex18 = 0; planIndex18 < planListLen18; planIndex18++) {
    var planData18 = planList18[planIndex18];
    soy.widget.plan(planData18, output);
  }
  return opt_sb ? '' : output.toString();
};
