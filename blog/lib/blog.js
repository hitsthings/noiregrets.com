var path = require('path'),
	express = require('express');

var Configuration = require('../../lib/conf');

var markdown = require('./markdown');

var render = require('../../lib/noir-util').render;
var redirectGET = require('../../lib/express-util').redirectGET;

var Post = require('./model/post');

function checkPerms(req, res, next) {
	if (req.user && req.user.admin) {
		next();
	} else if(req.user) {
		res.send(401);
	} else {
		redirectGET('/login?next='+ encodeURIComponent(path.join(req.app.set('basepath'), req.url)))
			(req, res, next);
	}
}

function getUrl(post, basepath) {
	var path = basepath || '/';

	if (path[path.length - 1] !== '/') {
		path += '/';
	}

	var date = post.publishDate || post.lastEditDate;

	var publishDateISO = date.toISOString();
	publishDateISO = publishDateISO.substring(0, publishDateISO.indexOf('T'));
	path += publishDateISO.replace(/-/g, '/');

	path += '/' + post.md5Id.substring(0, 8);

	path += '/' + post.title.replace(/[^a-z0-9]+/gi, '-');

	return path;
}

function toPostView(post, basepath) {
	var view = {
		id : post.md5Id,
		url : getUrl(post, basepath),
		title :  post.title,
		bodyHtml : markdown.toHTML(post.bodyMarkdown),
		snippetHtml : markdown.toHTML(post.bodyMarkdown),
		bodyMarkdown : post.bodyMarkdown,
		published : !!post.published,
		publishDateISO8601 : post.publishDate && post.publishDate.toISOString(),
		lastEditDateISO8601 : post.lastEditDate && post.lastEditDate.toISOString()
	};
	return view;
}

function extractBlogPost(req, res, next) {
	var blogDate = new Date(
		req.params.year,
		req.params.month - 1,
		req.params.day);
	var idStart = req.params.idStart;
	var titleSlug = req.params.titleSlug;

	var dayMillis = 24 * 60 * 60 * 1000;

	Post.where('publishDate').gte(blogDate)
		.where('publishDate').lt(new Date(+blogDate + dayMillis))
		.where('md5Id').regex(new RegExp("^" + idStart))
		.findOne(function(err, post) {
			if (err) {
				return next(err);
			}

			if (!post) {
				Post.where('lastEditDate').gte(blogDate)
					.where('lastEditDate').lt(new Date(+blogDate + dayMillis))
					.where('md5Id').regex(new RegExp("^" + idStart))
					.findOne(function(err, post) {
						if (err) {
							return next(err);
						}

						if (!post) {
							return res.send(404);
						}

						req.blogPost = post;
						next();
					});
				return;
			}

			req.blogPost = post;
			next();
		});
}

var has = Object.prototype.hasOwnProperty;
function merge() {
	var ret = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		var arg = arguments[i];
		if (arg && typeof arg === 'object') {
			for (var k in arg) {
				if (has.call(arg, k)) {
					ret[k] = arg[k];
				}
			}	
		}
	}
	return ret;
}

exports.createApp = function(callback, options) {
	options = options || {};

	var baseDir = path.join(__dirname, '..');
	var basePath = options.basePath;
	var layoutDest = path.join(baseDir, 'public/js/soy/layout.js');

	var configuration = new Configuration(baseDir, basePath, layoutDest);
	var app = express.createServer(express.logger());

	configuration.configure(app, options);

	var basepath = app.set('basepath');

	var viewOptions = app.set('view options');
	viewOptions = merge({ headHtml : '', bottomHtml: '' }, viewOptions);

	function style(file) {
		return '<link rel="stylesheet" href="' +
		path.join(basepath, file).replace(/\\/g, '/') +
		'" />';
	}
	function script(file) {
		return '<script src="' +
		path.join(basepath, file).replace(/\\/g, '/') +
		'"></script>';
	}

	viewOptions.headHtml += style('css/layout.css');
	viewOptions.headHtml += style('css/theme.css');
	viewOptions.bottomHtml += script('lib/moment.min.js');
	viewOptions.bottomHtml += script('js/markdown.js');

	viewOptions.headHtml += style('lib/highlight.js/styles/arta.css');
	viewOptions.bottomHtml += script('lib/highlight.js/highlight.pack.js');

	viewOptions.bottomHtml += script('js/blog.js');


	app.set('view options', viewOptions);

	app.get('/', render('page/posts', function(req, res, cb) {
		var query = Post
			.where('published', true)
			.desc('publishDate');
		if (req.query.start) {
			query = query.skip(req.query.start);
		}
		query.exec(function (err, res) {
			if(err) {
				return cb(err);
			}
			cb(null, {
				posts : res.map(function(post) {
					return toPostView(post, basepath);
				})
			});
		});
	}));

	app.get('/:year/:month/:day/:idStart/:titleSlug',
			extractBlogPost,
			function(req, res, next) {
				var view = toPostView(req.blogPost, basepath);
				render('page/post', view)(req, res, next);
			});

	app.get('/:year/:month/:day/:idStart/:titleSlug/edit',
			checkPerms,
			extractBlogPost,
			render('page/edit', function(req, res) {
				return toPostView(req.blogPost, basepath);
			})
	);
	app.post('/:year/:month/:day/:idStart/:titleSlug/edit',
			checkPerms,
			extractBlogPost,
			render('page/edit', function(req, res, next) {
				var post = req.blogPost;
				var b = req.body;

				var date = new Date();

				post.title = b.title;
				post.bodyMarkdown = b.body.replace(/\r\n/g, '\n');
				post.published = b.publish;
				if (Boolean(b.publish) !== Boolean(post.publishDate)) {
					post.publishDate = b.publish ? date : null;	
				}
				post.lastEditDate = date;

				post.save(function(err, result) {
					if (err) {
						return next(err);
					}
					var url = getUrl(post, basepath) + "/edit";
					redirectGET(url)(req, res, next);
				});
			})
	);

	app.get('/create', checkPerms, render('page/edit'));
	app.post('/create', checkPerms, function(req, res, next) {
		var date = new Date();
		var b = req.body;

		var postDescriptor = {
			title : b.title,
			bodyMarkdown : b.body.replace(/\r\n/g, '\n'),
			published : !!b.publish,
			publishDate : b.publish ? date : null,
			lastEditDate : date,
			createDate : date
		};

		var hash = require('crypto').createHash('md5');
		hash.update(date.getTime() + "");
		hash.update(postDescriptor.title);
		hash.update(postDescriptor.bodyMarkdown);
		
		postDescriptor.md5Id = hash.digest('hex');

		var post = new Post(postDescriptor);

		post.save(function(err, result) {
			if (err) {
				return next(err);
			}
			var url = getUrl(post, basepath) + "/edit";
			redirectGET(url)(req, res, next);
		});
	});

	callback(null, app);
};