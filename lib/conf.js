var express = require('express');
var expressUtil = require('./express-util');

var fs = require('fs');
var path = require('path');

var passport = require('passport');

var SoyRenderer = require('../soy-renderer/soy');

var defaultBaseDir = path.join(__dirname, '..');

// Must use a global renderer - express won't scope our app.register calls to each app. :(
var soyRenderer = new SoyRenderer();


function cloneLayout(layoutPath, toPath) {
    if (layoutPath && toPath) {
        fs.writeFileSync(toPath, fs.readFileSync(layoutPath));
    }
}

function Configuration(opt_baseDir, opt_basePath, opt_layoutDest) {
    var baseDir = opt_baseDir || defaultBaseDir;
    this._staticDir = path.join(baseDir, 'public');
    this._soyOutDir = path.join(baseDir, 'public','js','soy');

    this.schema = Configuration.defaults.schema;
    this.domain = Configuration.defaults.domain;
    this.port = Configuration.defaults.port;
    this.mail = Configuration.defaults.mail;
    this.recaptcha = Configuration.defaults.recaptcha;

    this.basePath = opt_basePath || '/';

    this.layoutDest = opt_layoutDest;
}
Configuration.defaults = {
    domain : 'localhost',
    port : '3000',
    schema : 'http',
    mail : {
        transport : {
            service : "Gmail",
            auth : {
                user : '??????',
                pass : '??????'
            }
        },
        numAttempts: 2,
        fromAddress: '??????'
    }
};

Configuration.setStaticDir = function(staticDir) {
    this._staticDir = path.resolve(process.cwd(), staticDir);
};
Configuration.setSoyOutputDir = function(soyOutDir) {
    this._soyOutDir = path.resolve(process.cwd(), soyOutDir);
};
Configuration.setMail = function(mailConfig) {
    this.mail = mailConfig;
};
Configuration.prototype.configure = function(app, options) {

    var self = this;

    cloneLayout(options && options.layout, this.layoutDest);

    app.set('basepath', this.basePath);

    app.configure(function() {
        soyRenderer.loadTemplateDirSync(self._soyOutDir);
        app.register('js', soyRenderer);
        app.set('view engine', 'js');
        app.set('views', self._soyOutDir);

        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.session({ secret: 'keyboard cat' }));
        app.use(expressUtil.flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(app.router);
    });

    app.configure('development', function() {
        soyRenderer.setOptions({ cacheTemplates : false });

        app.use(express.responseTime());
        app.use(express['static'](self._staticDir));
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));   
    });

    app.configure('production', function() {
        var oneYear = 31557600000;
        app.use(express['static'](self._staticDir, { maxAge: oneYear}));
        app.use(express.errorHandler());
    });

    return app;
};

module.exports = Configuration;