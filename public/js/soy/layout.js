// This file was automatically generated from layout.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }


soy.layout = function(opt_data, opt_sb, opt_ijData) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<!DOCTYPE html><html><head><meta charset="utf-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><title>Noir Egrets</title><!--[if lt IE 9]><script src="/lib/html5shim/html5.js"><\/script><![endif]--><link rel="stylesheet" href="/layout.css" /><link rel="stylesheet" href="/theme.css" />', (opt_data.headHtml) ? opt_data.headHtml : '', '\n\t\t<script type="text/javascript">\n\t\t  var _gaq = _gaq || [];\n\t\t  _gaq.push([\'_setAccount\', \'UA-36416854-1\']);\n\t\t  _gaq.push([\'_trackPageview\']);\n\n\t\t  (function() {\n\t\t    var ga = document.createElement(\'script\'); ga.type = \'text/javascript\'; ga.async = true;\n\t\t    ga.src = (\'https:\' == document.location.protocol ? \'https://ssl\' : \'http://www\') + \'.google-analytics.com/ga.js\';\n\t\t    var s = document.getElementsByTagName(\'script\')[0]; s.parentNode.insertBefore(ga, s);\n\t\t  })();\n\t\t<\/script>\n\t\t</head><body><div id="page"><header id="header" role="banner"><div><h1><a href="/">Noir Egrets</a></h1><nav><ul><li><a href="/blog">Blog</a></li><li><a href="/repos">Libs</a></li></ul></nav></div><div>', (opt_ijData.user) ? '<a href="/logout">Log out (' + soy.$$escapeHtml(opt_ijData.user.username) + ')</a>' : '<a href="/login">Log in</a>', '</div></header><section id="main" role="main">', opt_data.body, '</section><footer id="footer" role="contentinfo"><nav role="navigation"><div><h3><a href="/blog">Blog</a></h3></div><div><h3><a href="/repos">Libraries and Tools</a></h3><ul><li><a href="http://bitbucket.org/aahmed/meat">MEAT</a></li><li><a href="http://bitbucket.org/aahmed/bitbucket-widget">bitbucket-widget</a></li><li><a href="http://github.com/hitsthings/soy-grunt-task">grunt-soy</a></li><li><a href="http://github.com/hitsthings/grunt-heroku-deploy">grunt-heroku-deploy</a></li><li><a href="http://github.com/hitsthings/zoneinfo-server">zoneinfo-server</a></li></ul></div></nav></footer></div><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"><\/script>', (opt_data.bottomHtml) ? opt_data.bottomHtml : '', '</body></html>');
  return opt_sb ? '' : output.toString();
};
