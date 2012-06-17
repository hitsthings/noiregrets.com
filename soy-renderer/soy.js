var fs = require('fs');
var path= require('path');
var vm = require('vm');

var soyutils = path.join(__dirname, 'soyutils.js');

function merge() {
	var target = Array.prototype.shift.call(arguments);
	for(var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
		for(var key in arg) {
			if (Object.prototype.hasOwnProperty.call(arg, key)) {
				target[key] = arg[key];
			}
		}
	}
	return target;
}

function SoyRenderer(options) {
	this.setOptions(options, true);
}

SoyRenderer.defaults = {
	runInSeparateContext : false,
	cacheTemplates : true
};

SoyRenderer.prototype.setOptions = function(options, internal_force) {
	options = merge({}, SoyRenderer.defaults, this._options || {}, options);

	if (internal_force || options.runInSeparateContext != this._options.runInSeparateContext) {
		this._cache = {};

		if (options.runInSeparateContext) {
			this._context = vm.createContext();
			vm.runInContext(fs.readFileSync(soyutils, 'utf8'), this._context, soyutils);
		} else {
			vm.runInThisContext(fs.readFileSync(soyutils, 'utf8'), soyutils);
		}
	}

	if (!options.cacheTemplates) {
		this._cache = null;
	}

	this._options = options;
}

//page/index-thing.soy.js => soy.page.indexThing
function mapFileNameToTemplateName(file) {
	return 'soy.' + file.replace(/[\\\/]|-.|\.js$/g, function(str) {
		switch(str[0]) {
			case '.': //.js
				return '';
			case '\\':
			case '/':
				return '.';
			case '-': //-
				return str[1].toUpperCase();	
		}
	});
}

SoyRenderer.prototype._evalAndCache = function(script, templateName, filepath) {
	if (this._context) {
		vm.runInContext(script, this._context, filepath);
	} else {
		vm.runInThisContext(script, filepath);
	}

	var steps = templateName.split('.');
	var curr = this._context || global;
	while(curr && steps.length) {
		curr = curr[steps.shift()];
	}

	if (curr) {
		return this._cache ? (this._cache[templateName] = curr) : curr;
	}

	throw new Error("Template '" + templateName + "' was not found after evaluating script at " + filepath);
};

SoyRenderer.prototype.loadTemplateSync = function(filepath, templateName) {
	return this._evalAndCache(fs.readFileSync(filepath, 'utf8'), templateName, filepath);
};

SoyRenderer.prototype.loadTemplate = function(filepath, templateName, callback) {
	var self = this;
	fs.readFile(filepath, 'utf8', function(err, data) {
		if  (err) {
			callback(err);
		}

		callback(null, self._evalAndCache(data, templateName, filepath));
	});
};

SoyRenderer.prototype.loadTemplateDir = function(dirpath, callback, mapFilenameToTemplateName, filter, root) {
	var self = this;
	fs.readdir(dirpath, function(err, files) {
		var count = 0;

		function end() {
			if (!--count && callback) {
				callback();
			}
		}

		files.forEach(function(file) {
			count++;

			var filepath = path.join(dirpath,file);
			fs.stat(filepath, function(err, stat) {

				if (stat.isDirectory()) {
					self.loadTemplateDir(filepath, end, mapFilenameToTemplateName, filter, root || dirpath);

				} else if (!filter || filter(filepath)) {
					self.loadTemplate(filepath, (mapFilenameToTemplateName || mapFileNameToTemplateName)(path.relative(root || dirpath, filepath)), end);
				}
			});
		});
	});
};

SoyRenderer.prototype.loadTemplateDirSync = function(dirpath, mapFilenameToTemplateName, filter, root) {
	var self = this;
	var subdirs = [];
	fs.readdirSync(dirpath).forEach(function(file) {
		var filepath = path.join(dirpath,file);
		
		if (fs.statSync(filepath).isDirectory()) {
			subdirs.push(filepath);

		} else if (!filter || filter(filepath)) {
			self.loadTemplateSync(filepath, (mapFilenameToTemplateName || mapFileNameToTemplateName)(path.relative(root || dirpath, filepath)));
		}
	});
	subdirs.forEach(function(filepath) {
		self.loadTemplateDirSync(filepath, mapFilenameToTemplateName, filter, root || dirpath);			
	});
};

function withIj(template, options) {
	return function(data, ij) {
		return template.call(this, merge({}, options, data), undefined, merge({}, options.ij, ij));
	}
};

SoyRenderer.prototype.compile = function (str, options) {
	var templateName = (options.mapFilenameToTemplateName || mapFileNameToTemplateName)(path.relative(options.root, options.filename));

	if (this._cache && this._cache[templateName]) {
		return withIj(this._cache[templateName], options);
	}

	console.log(templateName + ' not in cache.');
	console.dir(this._options);

	return withIj(this._evalAndCache(str, templateName, options.filename), options);
};

SoyRenderer.prototype.__express = function(filename, options, fn) {
	var templateName = (options.mapFilenameToTemplateName || mapFileNameToTemplateName)(path.relative(options.root, filename));

	if (this._cache && this._cache[templateName]) {
		fn(null, withIj(this._cache[templateName], options)());
		return;
	}

	this.loadTemplate(filename, templateName, function(err, template) {
		fn(err, template && withIj(template, options)());
	});
};

module.exports = SoyRenderer;