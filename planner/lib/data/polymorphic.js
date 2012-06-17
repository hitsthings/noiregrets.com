/** NOTE: This module is currently unused. **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function PolymorphicSchema(schemasByModelName, modelPrefix, typeProperty) {

    modelPrefix = modelPrefix || '';
    typeProperty = typeProperty || '_type';

    var names = [];

    var modelsByName = {};
    var protosByName = {};

    var abstractSchema;
    var abstractSchemaDescriptor;

    function forEachSubSchema(fn) {
        for(var modelName in schemasByModelName) {
            if (schemasByModelName.hasOwnProperty(modelName)) {
                fn(schemasByModelName[modelName], modelName);
            }
        }        
    }

    forEachSubSchema(function(schema, modelName) {
        names.push(modelName);

        var typeDescriptor = {};
        typeDescriptor[typeProperty] = { type: String, default: modelName };
        schema.add(typeDescriptor);
    });

    abstractSchemaDescriptor = {};
    abstractSchemaDescriptor[typeProperty] = {
        type: String,
        enum: names
    };

    abstractSchema = new Schema(abstractSchemaDescriptor, { strict: false });

    abstractSchema.pre('init', function(next, doc) {
        console.dir(doc);

        var name = doc[typeProperty];
        var SubModel = modelsByName[name] ||
            (modelsByName[name] = mongoose.model(modelPrefix + name, schemasByModelName[name]));

        var proto;

        if (!SubModel.prototype.isPrototypeOf(this)) {
            proto = protosByName[name] ||
                (protosByName[name] = (new SubModel()).__proto__);
            
            this.__proto__ = proto;

            // rerun the ctor functions with the real model's
            // schema instead of the abstractSchema

            // BRITTLE: currently there is no logic in the Model ctor
            // there _is_ logic in the Document ctor, but it's idempotent.
            // if the Document ctor changes, this could stop working.
            SubModel.call(this, doc, this._selected);

            // now when Document.prototype.init is called, it will also
            // be given the correct schema to work with.
        }

        next();
        return this;
    });

    var sharedCollection;
    var modelsToInit = [];

    function setToSharedCollection(model) {
        model.prototype.collection = sharedCollection;
    }

    abstractSchema.on('init', function(model) {
        sharedCollection = model.prototype.collection;

        if (modelsToInit.length) {
            modelsToInit.forEach(setToSharedCollection);
        }
        modelsToInit = null;
    });

    forEachSubSchema(function(schema, modelName) {
        schema.on('init', function(model) {
            modelsByName[model.prototype.modelName] = model;

            if (sharedCollection) {
                setToSharedCollection(model);
            } else {
                modelsToInit.push(model);
            }
        });
    });

    return abstractSchema;
}

