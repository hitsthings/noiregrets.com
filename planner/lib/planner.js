var path = require('path'),
	express = require('express');

var Configuration = require('../../lib/conf');

var render = require('../../lib/noir-util').render;


function checkPrereqs (req, res, next) {
	if (!req.user) {
		console.log("Users should not be able to access urls in the planner app when unauthorized." +
		" Please ensure req.user is set before control reaches the planner app.");
		res.send(401);
	} else if (!req.user.email) {
		console.log("Users should not be able to access urls in the planner app without email confirmed.");
		res.send(401);
	} else {
		next();
	}
}


exports.createApp = function(callback, options) {
	options = options || {};

	var baseDir = path.join(__dirname, '..');
	var basePath = options.basePath;
	var layoutDest = path.join(baseDir, 'public/js/soy/layout.js');

	var configuration = new Configuration(baseDir, basePath, layoutDest);
	var app = express.createServer(express.logger());

	configuration.configure(app, options);


	app.use(checkPrereqs);

	app.get('/', render('page/planner', function(req, res) {
	}));

	callback(null, app);
};