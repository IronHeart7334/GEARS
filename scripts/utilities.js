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

function drawGear(x, y, width, color, rotated){
    var size = width / 5;
    var gear1 = [
        [1, 0, 1, 0, 1],
        [0, 1, 1, 1, 0],
        [1, 1, 0, 1, 1],
        [0, 1, 1, 1, 0],
        [1, 0, 1, 0, 1]
    ];

    var gear2 = [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 0, 1, 0]
    ];

    if (!rotated){
        var gear_map = gear1;
    }

    if (rotated){
        var gear_map = gear2;
    }
    canvas.fillStyle = color;

    for (var row = 0; row < gear_map.length; row++) {
        for (var column = 0; column < gear_map[row].length; column++){
            if (gear_map[row][column] != 0){
                canvas.fillRect(x + size * row, y + size * column, size, size);
            }	
        }
    }
}