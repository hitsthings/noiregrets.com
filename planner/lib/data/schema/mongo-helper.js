
function singletonList(schema, listProp, virtualName) {
    schema.virtual(virtualName)
        .get(function()    { return this.get(listProp)[0]; })
        .set(function(val) { this.set(listProp, [ val ]); });
}

exports.singletonList = singletonList;