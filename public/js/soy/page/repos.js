// This file was automatically generated from repos.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.repos = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<h1>Libraries and Tools</h1>');
  var repoList140 = ['meat', 'bitbucket-widget'];
  var repoListLen140 = repoList140.length;
  for (var repoIndex140 = 0; repoIndex140 < repoListLen140; repoIndex140++) {
    var repoData140 = repoList140[repoIndex140];
    soy.page.bitbucketRepo({repoName: repoData140}, output, opt_ijData);
  }
  var repoList144 = ['soy-grunt-task', 'grunt-heroku-deploy', 'zoneinfo-server'];
  var repoListLen144 = repoList144.length;
  for (var repoIndex144 = 0; repoIndex144 < repoListLen144; repoIndex144++) {
    var repoData144 = repoList144[repoIndex144];
    soy.page.githubRepo({repoName: repoData144}, output, opt_ijData);
  }
  return opt_sb ? '' : output.toString();
};


soy.page.githubRepo = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="github-widget" data-repo="hitsthings/', soy.$$escapeHtml(opt_data.repoName), '"></div>');
  return opt_sb ? '' : output.toString();
};


soy.page.bitbucketRepo = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="bitbucket-widget" data-repo="aahmed/', soy.$$escapeHtml(opt_data.repoName), '"></div>');
  return opt_sb ? '' : output.toString();
};
