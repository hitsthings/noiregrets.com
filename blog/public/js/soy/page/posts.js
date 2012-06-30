// This file was automatically generated from posts.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.posts = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<div class="posts-layout">');
  var postList24 = opt_data.posts;
  var postListLen24 = postList24.length;
  for (var postIndex24 = 0; postIndex24 < postListLen24; postIndex24++) {
    var postData24 = postList24[postIndex24];
    soy.widget.post(soy.$$augmentData(postData24, {bodyHtml: postData24.snippetHtml}), output);
    output.append('<aside>');
    soy.widget.commentCount({postUrl: postData24.url}, output);
    output.append('</aside>');
  }
  output.append('</div><script type="text/javascript">\r\n\t\t/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */\r\n\t\tvar disqus_shortname = \'noiregrets\'; // required: replace example with your forum shortname\r\n\r\n\t\t/* * * DON\'T EDIT BELOW THIS LINE * * */\r\n\t\t(function () {\r\n\t\t    var s = document.createElement(\'script\'); s.async = true;\r\n\t\t    s.type = \'text/javascript\';\r\n\t\t    s.src = \'http://\' + disqus_shortname + \'.disqus.com/count.js\';\r\n\t\t    (document.getElementsByTagName(\'HEAD\')[0] || document.getElementsByTagName(\'BODY\')[0]).appendChild(s);\r\n\t\t}());\r\n\t<\/script>');
  return opt_sb ? '' : output.toString();
};
