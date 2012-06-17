function doRender(req, res, view, data) {
    data = data || {};

    data.ij = { user : req.user };
    res.render(view, data);
}

exports.render = function (view, data_or_datafn) {
    return function(req, res, next) {
        var data;
        if (data_or_datafn instanceof Function) {
            if (data_or_datafn.length < 3) {
                data = data_or_datafn(req, res);
            } else {
                return data_or_datafn(req, res, function(err, data) {
                    if (err) {
                        return next(err);
                    }
                    doRender(req, res, view, data);
                });
            }
        } else {
            data = data_or_datafn;
        }
        doRender(req, res, view, data);
    };
};