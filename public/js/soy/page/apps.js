// This file was automatically generated from apps.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.apps = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<h1>Apps</h1><dl>');
  var appList34 = opt_data.apps;
  var appListLen34 = appList34.length;
  for (var appIndex34 = 0; appIndex34 < appListLen34; appIndex34++) {
    var appData34 = appList34[appIndex34];
    soy.page.app(appData34, output, opt_ijData);
  }
  output.append('</dl>');
  return opt_sb ? '' : output.toString();
};


soy.page.app = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t', (opt_data.listed) ? '<dt class="noir-app"><a href="' + soy.$$escapeHtml(opt_data.url) + '">' + soy.$$escapeHtml(opt_data.name) + '</a></dt><dd>' + soy.$$escapeHtml(opt_data.description) + '</dd>' : '');
  return opt_sb ? '' : output.toString();
};
