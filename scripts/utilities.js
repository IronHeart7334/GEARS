//works
function extend(constructor, superConstructor){
    var superProto = Object.create(superConstructor.prototype);
    for(var method in superProto){
        constructor.prototype[method] = superProto[method];
    }
}