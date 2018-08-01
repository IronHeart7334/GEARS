//works
function extend(constructor, superConstructor){
    var superProto = Object.create(superConstructor.prototype);
    for(var method in superProto){
        constructor.prototype[method] = superProto[method];
    }
}

function isFunction(check){
    return typeof check === typeof function(){};
}

function max(array){
    var ret = -Infinity;
    function isMax(value){
        if(value > ret){
            ret = value;
        }
    }
    array.forEach(isMax);
    return ret;
}