var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function validLength(opt_minlen, maxlen) {

	var minlen;
	if (arguments.length < 2) {
		minlen = null;
		maxlen = opt_minlen;
	} else {
		minlen = opt_minlen;
	}

	return function(str) {
		return !str || (
				(maxlen == null || str.length <= maxlen) &&
				(minlen == null || str.length >= minlen)
			);
	};
}

var PostSchema = new Schema({
	md5Id : { type:String, required:true },
	published : { type:Boolean, 'default':false },
	createDate : { type:Date, 'default':Date.now },
	publishDate : Date,
	lastEditDate : { type:Date, 'default':Date.now },
	title : { type:String, required:true, trim:true, validate:validLength(255) },
	bodyMarkdown : { type:String, required:true }
});

module.exports = mongoose.model('Post', PostSchema);