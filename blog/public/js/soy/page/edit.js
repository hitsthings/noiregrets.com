// This file was automatically generated from edit.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.edit = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="form-layout"><form method="POST" action=""', (opt_data.id) ? ' data-post-id="' + soy.$$escapeHtml(opt_data.id) + '"' : '', '><div class="field"><label for="title">Title</label><input type="text" id="title" name="title" value="', soy.$$escapeHtml(opt_data.title ? opt_data.title : ''), '" /></div><div class="field"><label for="body">Body</label><textarea id="body" name="body">', soy.$$escapeHtml(opt_data.bodyMarkdown ? opt_data.bodyMarkdown : ''), '</textarea></div><div class="field"><label for="publish">Publish?</label><input type="checkbox" id="publish" name="publish" ', soy.$$escapeHtml(opt_data.published ? 'checked' : ''), ' /></div><div class="buttons"><input type="submit" value="Save" /></div></form></div>');
  return opt_sb ? '' : output.toString();
};
