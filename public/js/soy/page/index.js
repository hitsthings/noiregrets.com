// This file was automatically generated from index.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.index = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<h1>Welcome</h1><p>You\'ve reached the website of Adam Ahmed, a Javascript developer at <a href="http://www.atlassian.com">Atlassian</a>. Enjoy!</p><p class="signature"><a href="http://www.twitter.com/hitsthings">@hitsthings</a></p>');
  return opt_sb ? '' : output.toString();
};
