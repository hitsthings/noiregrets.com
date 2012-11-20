// This file was automatically generated from repos.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.repos = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<h1>Libraries and Tools</h1>');
  var repoList146 = ['meat', 'bitbucket-widget'];
  var repoListLen146 = repoList146.length;
  for (var repoIndex146 = 0; repoIndex146 < repoListLen146; repoIndex146++) {
    var repoData146 = repoList146[repoIndex146];
    soy.page.bitbucketRepo({repoName: repoData146}, output, opt_ijData);
  }
  var repoList150 = ['soy-grunt-task', 'grunt-heroku-deploy', 'zoneinfo-server'];
  var repoListLen150 = repoList150.length;
  for (var repoIndex150 = 0; repoIndex150 < repoListLen150; repoIndex150++) {
    var repoData150 = repoList150[repoIndex150];
    soy.page.githubRepo({repoName: repoData150}, output, opt_ijData);
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
