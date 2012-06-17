// This file was automatically generated from repos.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.repos = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\n<style>\n.github-widget {\n    margin-top: 30px;\n}\n\n.github-widget .link {\n    display:none;\n}\n</style>\n<h1>Libraries and Tools</h1>');
  var repoList107 = ['soy-grunt-task', 'zoneinfo-server'];
  var repoListLen107 = repoList107.length;
  for (var repoIndex107 = 0; repoIndex107 < repoListLen107; repoIndex107++) {
    var repoData107 = repoList107[repoIndex107];
    soy.page.repo({repoName: repoData107}, output, opt_ijData);
  }
  return opt_sb ? '' : output.toString();
};


soy.page.repo = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="github-widget" data-repo="hitsthings/', soy.$$escapeHtml(opt_data.repoName), '"></div>');
  return opt_sb ? '' : output.toString();
};
