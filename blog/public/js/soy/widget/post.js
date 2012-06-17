// This file was automatically generated from post.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.widget == 'undefined') { soy.widget = {}; }


soy.widget.post = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<article data-id="', soy.$$escapeHtml(opt_data.id), '"', (! opt_data.published) ? ' data-status="draft"' : '', (opt_data.publishDateISO8601) ? ' data-publish-date="' + soy.$$escapeHtml(opt_data.publishDateISO8601) + '"' : '', (opt_data.lastEditDateISO8601) ? ' data-edit-date="' + soy.$$escapeHtml(opt_data.lastEditDateISO8601) + '"' : '', '><header><h1><a href="', soy.$$escapeHtml(opt_data.url), '">', soy.$$escapeHtml(opt_data.title), '</a></h1><dl class="metadata hidden"></dl></header><section>', opt_data.bodyHtml, '</section></article>');
  return opt_sb ? '' : output.toString();
};
