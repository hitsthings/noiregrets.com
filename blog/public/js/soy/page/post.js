// This file was automatically generated from post.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.post = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="post-layout"><a class="back-nav" href="/blog">Back to recent posts</a>');
  soy.widget.post(opt_data, output);
  output.append('<aside id="disqus_thread"><script type="text/javascript">\r\n                /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */\r\n                var disqus_shortname = \'noiregrets\'; // required: replace example with your forum shortname\r\n\r\n                /* * * DON\'T EDIT BELOW THIS LINE * * */\r\n                (function() {\r\n                    var dsq = document.createElement(\'script\'); dsq.type = \'text/javascript\'; dsq.async = true;\r\n                    dsq.src = \'http://\' + disqus_shortname + \'.disqus.com/embed.js\';\r\n                    (document.getElementsByTagName(\'head\')[0] || document.getElementsByTagName(\'body\')[0]).appendChild(dsq);\r\n                })();\r\n            <\/script><noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript><a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a></aside></div>');
  return opt_sb ? '' : output.toString();
};
