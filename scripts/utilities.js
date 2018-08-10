//works
function extend(constructor, superConstructor){
    var superProto = Object.create(superConstructor.prototype);
    for(var method in superProto){
        if(!constructor.prototype.hasOwnProperty(method)){
            //don't overwrite existing properties
            constructor.prototype[method] = superProto[method];
        }
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

function between(min, val, max){
    return min <= val && val <= max;
}

function distance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function silver(value) {
    if (value > 10) {
        value = 10;
    }
    shade = value * 25;
    return "rgb(" + shade + ", " + shade + ", " + shade + ")";
}

function gold(value) {
    if (value > 10) {
        value = 10;
    }
    shade = value * 25;
    return "rgb(" + shade + ", " + shade + ", " + 0 + ")";
}