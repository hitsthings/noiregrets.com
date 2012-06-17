function wrapQuery(mongoModel, fnName, wrapper) {

    return function() {
        var fn = Array.prototype.pop.call(arguments);
        var newFn;
        if (typeof fn === 'function') {
            newFn = function (err, res) {
                var self = this;
                if (!err && res) {
                    if (res.forEach) {
                        res = res.map(function(result) {
                            return wrapper.call(self, result);
                        });
                    } else {
                        res = wrapper.call(self, res);
                    }
                }
                return fn.call(this, err, res);
            };
        } else {
            newFn = fn;
        }

        Array.prototype.push.call(arguments, newFn);
        return mongoModel[fnName].apply(mongoModel, arguments);
    };
}

var push = Array.prototype.push,
    pop = Array.prototype.pop,
    shift = Array.prototype.shift,
    unshift = Array.prototype.unshift,
    splice = Array.prototype.splice,
    slice = Array.prototype.slice,
    map = Array.prototype.map;
function wrapArray(mongoArray, wrap, unwrap) {

    if (!mongoArray) {
        return mongoArray;
    }

    var items = mongoArray.map(wrap);

    return mongoProxyArray(items,mongoArray,wrap, unwrap);
}
function mongoProxyArray(items, mongoArray, wrap, unwrap) {
    items.push = function() {
        mongoArray.push.apply(mongoArray, map.call(arguments, unwrap));
        return push.apply(this,arguments);
    };
    items.pop = function() {
        mongoArray.pop();
        return pop.call(this);
    };
    items.shift = function() {
        mongoArray.shift();
        return shift.call(this);
    };
    items.unshift = function() {
        mongoArray.unshift.apply(mongoArray, map.call(arguments,unwrap));
        return unshift.apply(this, arguments);
    };
    items.splice  = function() {
        var args, els;
        if (arguments.length > 2) {
            els = slice.call(arguments, 2).map(unwrap);
            args = slice.call(arguments, 0, 2);
            push.apply(args, els);
        }
        mongoArray.splice.apply(this, args || arguments);
        return splice.apply(this, arguments);
    };

    return items;
}

function wrapProp(tree, prop, subWrap, wrapHolder) {
    if (tree[prop] instanceof Array) {
        get = function() {
            if (wrapHolder[prop]) {
                return wrapHolder[prop];
            }

            wrapHolder[prop] = wrapArray(
                this._mongo[prop],
                subWrap._fromMongo,
                subWrap._toMongo
            );

            return wrapHolder[prop];
        };
        set = function(val) {
            var mongoArray = this._mongo[prop] = val && val.length ?
                val.map(subWrap._toMongo) :
                val;
            wrapHolder[prop] = mongoProxyArray(
                val,
                mongoArray,
                subWrap._fromMongo,
                subWrap._toMongo
            );
        };
    } else {
        get = function() {
            wrapHolder[prop] = wrapHolder[prop] ||
                subWrap._fromMongo(this._mongo[prop]);
            return wrapHolder[prop];
        };
        set = function(val) {
            wrapHolder[prop] = val;
            this._mongo[prop] = val._mongo;
            return val;
        };
    }

    Object.defineProperty(this, prop, {
        enumerable : true,
        get : get,
        set : set
    });

}

function toRawDescriptor(descriptor, subWrapMap) {
    if (!descriptor) {
        return descriptor;
    }

    for(var prop in subWrapMap) {
        if (descriptor[prop]) {
            var toMongo = subWrapMap[prop]._toMongo;
            if (descriptor[prop] instanceof Array) {
                descriptor[prop] = descriptor[prop].map(toMongo);
            } else {
                descriptor[prop] = toMongo(descriptor[prop]);
            }
        }
    }
    return descriptor;
}

function mongoDelegateCtor(ctor, mongoModel, customDescriptors, subWrapMap, args) {
    var subWrap, prop, tree, get, set;

    tree = mongoModel.schema.tree;

    this._mongo = new mongoModel(toRawDescriptor(args[0], subWrapMap));

    subWrapMap = subWrapMap || {};
    var wrapHolder = {};

    for (prop in tree) {
        if (tree.hasOwnProperty(prop) && prop in subWrapMap && !(prop in customDescriptors)) {
            var subWrap = subWrapMap[prop] === 'self' ?
                    ctor :
                    subWrapMap[prop];
            wrapProp.call(this,
                tree, prop, subWrap, wrapHolder);
        }
    }
}
function mongoDelegateTransform(ctor, mongoModel, customDescriptors, subWrapMap) {
    function fromMongo(mongo) {
        var s = new ctor();
        s._mongo = mongo;
        return s;
    }
    function toMongo(thing) {
        return thing._mongo;
    }
    ctor._fromMongo = fromMongo;
    ctor._toMongo = toMongo;
    ctor._mongoModel = mongoModel;

    ctor.find = wrapQuery(mongoModel, 'find', fromMongo);
    ctor.findOne = wrapQuery(mongoModel, 'findOne', fromMongo);
    ctor.findById = wrapQuery(mongoModel, 'findById', fromMongo);

    ctor.prototype.save = function() {
        return this._mongo.save.apply(this._mongo, arguments);
    };
    ctor.prototype.remove = function() {
        return this._mongo.remove.apply(this._mongo, arguments);
    };

    var subWrap, prop, tree, get, set;

    tree = mongoModel.schema.tree;

    this._mongo = new mongoModel();

    subWrapMap = subWrapMap || {};
    var wrapHolder = {};

    for (prop in tree) {
        if (tree.hasOwnProperty(prop)) {
            if (prop in customDescriptors) {
                Object.defineProperty(ctor.prototype, prop,
                    customDescriptors[prop]);
            } else if (!(prop in subWrapMap)) {
                Object.defineProperty(ctor.prototype, prop, {
                    enumerable : true,
                    get : function () { return this._mongo[prop]; },
                    set : function (val) { this._mongo[prop] = val; }
                });
            }
        }
    }
}

module.exports = function wrap(mongoModel, customDescriptors, subWrapMap, initFn) {
    function model() {
        mongoDelegateCtor.call(this, model, mongoModel, customDescriptors, subWrapMap, arguments);
        if (initFn) {
            initFn.apply(this, arguments);
        }
    }
    mongoDelegateTransform(model, mongoModel, customDescriptors, subWrapMap);

    return model;
};