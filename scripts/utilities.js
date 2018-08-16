/*
 * These utility functions can be used in any program
 */

// TODO: move color functions

/*
 * Allows for easier class extention and inheritance
 * HOW TO USE:
 *   function a(...){}
 *   a.prototype = {...};
 *   
 *   function b(...){
 *      a.call(this, ...);
 *   }
 *   b.prototype = {...};
 *   
 *   extend(b, a);
 *
 * Think of it as 'class b extends a'
 * gives b access to all of a's methods, but DOES NOT OVERRIDE ANY OF b's
 */
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

// returns largest value in an array (seriously, why does JS not have this built in?)
function max(array){
    var ret = array[0];
    function isMax(value){
        if(value > ret){
            ret = value;
        }
    }
    array.forEach(isMax);
    return ret;
}

// returns whether or not a value is between two others, or equal to one of them
function between(min, val, max){
    return min <= val && val <= max;
}

function distance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

//color functions used by GEARS, will move / depreciate later
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