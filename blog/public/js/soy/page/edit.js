// This file was automatically generated from edit.soy.
// Please don't edit this file by hand.

if (typeof soy == 'undefined') { var soy = {}; }
if (typeof soy.page == 'undefined') { soy.page = {}; }


soy.page.edit = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<style>\r\n        .preview {\r\n            margin-top: 16px;\r\n        }\r\n    </style><div class="form-layout"><div><h2>Preview</h2><article class="preview"><header><h1><a href="#" id="titlePreview"></a></h1></header><section id="bodyPreview" style="width: 600px; min-height: 200px;"></section></article></div><form method="POST" action=""', (opt_data.id) ? ' data-post-id="' + soy.$$escapeHtml(opt_data.id) + '"' : '', '><div class="field"><label for="title">Title</label><input type="text" id="title" name="title" value="', soy.$$escapeHtml(opt_data.title ? opt_data.title : ''), '" /></div><div class="field"><label for="body">Body</label><textarea id="body" name="body" style="width: 450px; height: 200px;">', soy.$$escapeHtml(opt_data.bodyMarkdown ? opt_data.bodyMarkdown : ''), '</textarea></div><div class="field"><label for="publish">Publish?</label><input type="checkbox" id="publish" name="publish" ', soy.$$escapeHtml(opt_data.published ? 'checked' : ''), ' /></div><div class="buttons"><input type="submit" value="Save" /></div></form></div>');
  return opt_sb ? '' : output.toString();
};
