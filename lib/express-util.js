function cacheFor(seconds) {
    return function (req, res, next) {
        res.header('Cache-Control', 'public, max-age=' + seconds);
        next();
    };
}

// Anything saved in req.session.flash is removed from session, and is accessible in
// req.flash for the next request only.
function flash() {
    return function(req, res, next) {
        if (req.session.flash) {
            req.flash = req.session.flash;
            delete req.session.flash;
            req.session.save(next);
        } else {
            next();
        }
    };
}

function allowCORS(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
}

function render(view) {
	return function(req, res, next) {
		res.render(view);
	};
}

function redirectGET(uri) {
	return function(req, res, next) {
		res.writeHead(303, { 'Location': uri });
		res.end('\n');
	};
}

exports.allowCORS = allowCORS;
exports.cacheFor = cacheFor;
exports.render = render;
exports.redirectGET = redirectGET;
exports.flash = flash;