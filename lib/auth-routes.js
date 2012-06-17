var http = require('http');

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

function authRoutes(app, options) {

    var attempts = {};
    function requiresCaptcha(username) {
        return username && attempts[username] > 10;
    }
    function recordAttempt(username) {
        if (!username) {
            return;
        }
        attempts[username] = (typeof attempts[username] === 'number' && attempts[username]) || 0;
        attempts[username]++;
    }

    var recaptchaOptions = (options && options.recaptcha) || {};
    var privateRecaptchaKey = recaptchaOptions.privateKey;
    var publicRecaptchaKey = recaptchaOptions.publicKey;

    app.get('/login', render('page/login', function(req, res) {
        var data = {
            showCaptcha : false,
            recaptchaKey : publicRecaptchaKey,
            next : req.query.next
        };
        if (req.flash) {
            if (req.flash.error) {
                if (req.flash.errorCode) {
                    data.captchaError = req.flash.errorCode;
                }
                data.errors = {
                    global : [
                        req.flash.error === 'captcha' ?
                            'You are required to fill in the CAPTCHA.' :
                            'Invalid username or password.'
                    ]
                };
            }
            data.values = { username : req.flash.username };
            data.showCaptcha = requiresCaptcha(req.flash.username);
        }
        return data;
    }));
    app.post('/login', function(req, res, next) {
        if (!requiresCaptcha(req.body.username)) {
            return next();
        }
        var reChallenge, reResponse;
        if (!(reChallenge = req.body['recaptcha_challenge_field']) ||
            !(reResponse = req.body['recaptcha_response_field'])) {

            req.session.flash = {
                error : 'captcha',
                username: req.body['username']
            };
            req.session.save(function() {
                redirectGET('/login' +
                    (req.query['next'] ? '?next=' + req.query['next'] : ''))(req,res,next);
            });
            return;
        }

        var options = url.parse('http://www.google.com/recaptcha/api/verify');
        options.method = 'POST';
        options.headers = {
            'content-type' : 'application/x-www-form-urlencoded'
        };
        var request = http.request(options, function(response) {
            var lines = '';
            response.on('data', function(str) { lines += str; });
            response.on('end', function() {
                lines = lines.split('\n');

                if (/^true/i.test(lines[0])) {
                    return next();
                }
                req.session.flash = {
                    error : 'captcha',
                    errorCode : lines[1],
                    username: req.body['username']
                };
                req.session.save(function() {
                    redirectGET('/login' +
                        (req.query['next'] ? '?next=' + req.query['next'] : ''))(req,res,next);
                });
            });
        });
        var formData = 'privatekey=' + encodeURIComponent(privateRecaptchaKey) +
                        '&remoteip=' + encodeURIComponent(req.connection.remoteAddress) +
                        '&challenge=' + encodeURIComponent(reChallenge) +
                        '&response=' + encodeURIComponent(reResponse);
        request.write(formData);
        request.end();
    }, function(req, res, next) {
        var username = req.body.username;
        console.log(attempts[username]);
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                next(err);
            } else if (!user) {
                console.dir(info);
                recordAttempt(username);

                req.session.flash = {
                    error : 'userpass',
                    username: username
                };
                req.session.save(function() {
                    redirectGET('/login' + (req.query['next'] ? '?next=' + req.query['next'] : ''))(req,res,next);
                });
            } else {
                delete attempts[username];
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

exports.setup = function(app, options) {
    authRoutes(app, options);
    emailRoutes(app, options);
    userRoutes(app, options);
};