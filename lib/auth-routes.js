
var passport = require('passport');
var User = require('./model/user');

var url  = require('url');

var expressUtils = require('./express-util'),
    redirectGET = expressUtils.redirectGET;

var eventBus = require('./event-bus');

var render = require('./noir-util').render;

function requireLogin(req,res, next) {
    if (!req.user) {
        redirectGET('/login?next=' + encodeURIComponent(req.url))(req,res, next);
        return;
    }
    next();
}

function onSaveValidation(err, result, user) {
    if (err && err.code === 11000) { // duplicate
        return err.message.indexOf(user.get('email')) !== -1 ?
            { email : [ 'This email address is already registered.' ] } :
            { username : [ 'This username is already in use.' ] };
    } else if (err && err.name === 'ValidationError') {

        var errors = {};
        for(var error in err.errors) {
            if (err.errors.hasOwnProperty(error)) {
                errors[error] = [ err.errors[error].type ];
            }
        }
        return errors;
    } else {
        return null;
    }
}

function authRoutes(app) {
    app.get('/login', render('page/login', function(req, res) {
        if (req.flash && req.flash.error) {
            return {
                errors : {
                    global : [ 'Invalid username or password.' ]
                },
                values : { username : req.flash.username },
                next : req.query['next']
            };
        }
    }));
    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                next(err);
            } else if (!user) {
                req.session.flash = {
                    error : true,
                    username: req.body['username']
                };
                req.session.save(function() {
                    redirectGET('/login' + (req.query['next'] ? '?next=' + req.query['next'] : ''))(req,res,next);
                });
            } else {
                req.logIn(user, next);
            }
        })(req, res, next);
    }, function(req, res, next) {
        if (req.query['next']) {
            res.redirect(url.parse(req.query['next']).path);
        } else {
            next();
        }
    }, redirectGET('/'));

    app.all('/logout', function(req, res, next) { req.session.destroy(next); }, redirectGET('/'));

    app.get('/signup', render('page/signup'));
    app.post('/signup', function(req, res, next) {
        var err, user;

        var username = req.body['username'],
            password = req.body['password'],
            email = req.body['email'];

        if (!username) {
            err = err || {};
            err.username = [ "Username is required." ];
        }
        if (!password) {
            err = err || {};
            err.password = [ "Password is required." ];
        }

        if (err) {
            render('page/signup', {
                errors : err,
                values : {
                    username : username,
                    email : email
                }
            })(req, res, next);
            return;
        }

        user = new User();

        user.set('username', username);
        user.set('password', password);
        if (email) {
            user.set('email', email);
        }

        user.save(function(err, result) {
            var errView = onSaveValidation(err, result, user);
            if (errView) {
                render('page/signup', {
                    errors : errView,
                    values : {
                        username : username,
                        email: email
                    }
                })(req, res, next);
            } else {
                if (!err) {
                    eventBus.emitUserAdded(user);
                }
                next(err, result);
            }
        });
    }, passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));
}

function emailRoutes(app) {
    app.get('/email-confirm/:confirmationHash', function(req, res, next) {
        function setConfirmed(user) {
            if (req.params.confirmationHash === user.get('emailConfirmationHash')) {
                user.set('emailConfirmed', true);
                user.save(function(err, result) {
                    next(err);
                });
            } else {
                render('page/email-confirmation', {
                    succeeded : false,
                    email : req.query.email,
                    reason : 'The confirmation code you entered is invalid.'
                })(req, res, next);
            }
        }

        if (!req.user || req.user.get('email') !== req.query.email) {
            User.findOne({ email : req.query.email }, function(err, user) {
                if (err) {
                    next(err);
                } else if (user) {
                    setConfirmed(user);
                } else {
                    render('page/email-confirmation', {
                        succeeded : false,
                        email : req.query.email,
                        reason : 'Your email address (' + req.query.email + ') is not registered with Noir Egrets.',
                        showSignup : true
                    })(req, res, next);
                }
            });
        } else {
            setConfirmed(req.user);
        }
    }, render('page/email-confirmation', function(req, res) {
        return {
            succeeded : true,
            email : req.query.email
        };
    }));

    var subapps = app.set('subapps');
    app.get('/email-required', requireLogin, render('page/email-required', function(req, res) {
        var app = subapps[req.query['app']] || {
            name : 'Other App',
            url : '/'
        };

        return {
            layout: false,
            appName : app.name,
            appUrl : app.url,
            email : req.user.get('email'),
            emailConfirmed : req.user.get('emailConfirmed')
        };
    }));

    app.get('/mailer/resend-verification', function(req, res, next) {
        if (req.user) {
            if (!req.user.get('emailConfirmed')) {
                eventBus.emitEmailVerificationRequested(req.user);
                res.send(204);
            } else {
                res.send(409);
            }
            return;
        }
        res.send(401);
    });
}

function userRoutes(app) {
    app.get('/profile', requireLogin, render('page/profile', function(req, res) {
        return {
            username : req.user.get('username'),
            email : req.user.get('email')
        };
    }));
    app.post('/profile', requireLogin, function(req, res, next) {
        if (req.body.email && req.user.get('email') !== req.body.email) {
            req.user.set('emailConfirmed', false);
            req.user.set('email', req.body.email);
            req.user.save(function(err, result) {
                var errView = onSaveValidation(err, result, req.user);
                if (errView) {
                    render('page/profile', {
                        errors : errView,
                        username : req.user.get('username'),
                        email: req.user.get('email')
                    })(req, res, next);
                } else {
                    if (!err) {
                        eventBus.emitEmailVerificationRequested(req.user);
                    }
                    next(err, result);
                }
            });
            return;
        }
        next();
    }, redirectGET('/profile'));
}

exports.setup = function(app) {
    authRoutes(app);
    emailRoutes(app);
    userRoutes(app);
};