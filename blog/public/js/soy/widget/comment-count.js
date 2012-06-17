// This file was automatically generated from comment-count.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.widget == 'undefined') { soy.widget = {}; }


soy.widget.commentCount = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<a class="comment-count" href="', soy.$$escapeHtml(opt_data.postUrl), '#disqus_thread">Comments</a>');
  return opt_sb ? '' : output.toString();
};
