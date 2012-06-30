/*
 * noiregrets.com
 * https://github.com/hitsthings/noiregrets.com
 *
 * Copyright (c) 2012 Adam Ahmed
 * Licensed under the MIT license.
 */

var express = require('express');

var expressUtils = require('./express-util'),
	redirectGET = expressUtils.redirectGET;

var path = require('path');

var Configuration = require('./conf');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./model/user');

var authRoutes = require('./auth-routes');

var mailer = require('./mailer');

var eventBus = require('./event-bus');

var render = require('./noir-util').render;

var promise = require('../promise');

function setupRoutes(app, subapps, config) {
	app.get('/', render('page/index'));

	app.get('/repos', render('page/repos', {
		bottomHtml : '<script type="text/javascript" src="/lib/jquery.githubRepoWidget.min.js"></script>'
	}));

	app.get('/apps', render('page/apps', {
		apps : Object.keys(subapps).map(function(key) { return subapps[key]; })
	}));

	authRoutes.setup(app, config);

	function subappPreReqChecker(subapp) {
		return function(req, res, next) {
			if ((subapp.requires.login || subapp.requires.email) && !req.user) {
				res.redirect('/login?next=' + subapp.url);

			} else if (subapp.requires.email && (!req.user.get('email') || !req.user.get('emailConfirmed'))) {
				res.redirect('/email-required?app=' + appKey);

			} else {
				next();
			}
		};
	}

	for(var appKey in subapps) {
		if (subapps.hasOwnProperty(appKey)) {
			var subapp = subapps[appKey];
			app.get(subapp.url, subappPreReqChecker(subapp));
			app.use(subapp.url, subapp.app);
		}
	}
}

function setupPassport() {
	passport.use(new LocalStrategy(function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: 'Unknown user' });
			}
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Invalid password' });
			}
			return done(null, user);
		});
	}));

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(User.findById.bind(User));
}

exports.createApp = function(callback, options) {
	options = options || {};

	var baseDir = path.join(__dirname,'..');
	var basePath = options.basePath;

	var config = new Configuration(baseDir, basePath);

	var app = express.createServer(express.logger());

	setupPassport();

	config.configure(app);

	mailer.setConfiguration(config);

	var apps = {
		blog : {
			module : require('../blog'),
			app : null,
			name : 'Blog',
			url : '/blog',
			description : 'My JS-focused blog.',
			listed: false,
			requires : {
				login : false,
				email : false
			}
		},
		planner : {
			module : require('../planner'),
			app : null,
			name : 'Spontaneous Planner',
			url : '/planner',
			description: 'Spontaneity can be scheduled.',
			listed: true,
			requires : {
				login : false,
				email : true
			}
		}
	};
	app.set('subapps', apps);

	var promises = [];

	for(var subappKey in apps) {
		if (apps.hasOwnProperty(subappKey)) {
			var subapp = apps[subappKey];
			var subappPromise = promise();
			promises.push(subappPromise);
			subapp.module.createApp(subappPromise, {
				basePath : path.join(basePath || '/', subapp.url.substring(1)),
				layout : path.join(baseDir, 'public/js/soy/layout.js')
			});
		}
	}

	promise.when.apply(promise, promises).then(function(/* appArgs...*/) {

		var args = Array.prototype.slice.call(arguments);

		for(var subappKey in apps) {
			if (apps.hasOwnProperty(subappKey)) {
				apps[subappKey].app = args.shift()[0];
			}
		}

		setupRoutes(app, apps, config);

		callback(null, app);
	}, callback);

};
