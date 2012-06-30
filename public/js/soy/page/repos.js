// This file was automatically generated from repos.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.repos = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\n<style>\n.github-widget {\n    margin-top: 30px;\n}\n\n.github-widget .github-box .link {\n    margin-top: 1em;\n}\n</style>\n<h1>Libraries and Tools</h1>');
  var repoList140 = ['soy-grunt-task', 'grunt-heroku-deploy', 'zoneinfo-server'];
  var repoListLen140 = repoList140.length;
  for (var repoIndex140 = 0; repoIndex140 < repoListLen140; repoIndex140++) {
    var repoData140 = repoList140[repoIndex140];
    soy.page.repo({repoName: repoData140}, output, opt_ijData);
  }
  return opt_sb ? '' : output.toString();
};


soy.page.repo = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="github-widget" data-repo="hitsthings/', soy.$$escapeHtml(opt_data.repoName), '"></div>');
  return opt_sb ? '' : output.toString();
};
