module.exports = function() {
    var done = [], fail = [];
    var args;
    var called = false;
    var failed = false;
    var context;

    function cb(back) {
        back.apply(context, args);
    }

    function fwd() {
        (failed ? fail : done).forEach(cb);
        fail= done = []; 
    }

    var ret = function(/*args*/) {
        if (called) {
            return;
        }
        called = true;
        context = this;
        failed = !!arguments[0];
        args = failed ? [ arguments[0] ] : Array.prototype.slice.call(arguments, 1);
        fwd();
    };
    ret.then = function(success,failure) {
        if (called) {
            if (success) {
                done = [ success ];
            }
            if (failure) {
                fail = [ failure ];
            }
            fwd();
        } else {
            if (success) {
                done.push(success);
            }
            if (failure) {
                fail.push(failure);
            }
        }
        return ret;
    }
    return ret;
};

module.exports.when = function(/* promises */) {
    var cnt = arguments.length;

    var promiseAll = module.exports();

    if (!cnt) {
        promiseAll(null);
        return promiseAll;
    }
    
    var successArgs = new Array(cnt);

    function failure() {
        promiseAll.apply(this, arguments);
    }

    Array.prototype.forEach.call(arguments, function(promise, i) {
        promise.then(function() {
            successArgs[i] = arguments;
            if (!--cnt) {
                successArgs.unshift(null);
                promiseAll.apply(promiseAll, successArgs);
            }
        }, failure);
    });

    return promiseAll;
};