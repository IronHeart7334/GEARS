var canvas_size = 700; //used to create the canvas

//TODO: sprites

function Canvas(){
    this.linked = null; //the HTML canvas this will reference
    this.draw = null; //the context this will draw on
    this.width = 0;
    this.height = 0;
    this.xBound = 0; //the most this can be translated
    this.yBound = 0;
    this.xOffset = 0; //how much this is translated
    this.yOffset = 0;
    this.focusX = 0; //the point this is focusing on
    this.focusY = 0;
}
Canvas.prototype = {
    link : function(elementId){
        try{
            this.linked = document.getElementById(elementId);
            this.draw = this.linked.getContext("2d");
            this.width = this.linked.width;
            this.height = this.linked.height;
            this.xBound = this.width;
            this.yBound = this.height;
        } catch(e){
            console.log("Error linking to canvas with id " + elementId);
            console.log(e.stack);
        }
    },
    setContentSize : function(w, h){
        //how much this should be allowed to translate
        this.xBound = this.width - w;
        this.yBound = this.height - h;
    },
    setOffsets : function(x, y){
        this.xOffset = x;
        this.yOffset = y;
    },
    setFocus : function(x, y){
        this.focusX = x;
        this.focusY = y;
    },
    updateTranslate : function(){
        this.draw.save();
        var xShift = -this.focusX + this.xOffset;
        var yShift = -this.focusY + this.yOffset;
        
        if(xShift > 0){
            xShift = 0;
        } else if(xShift < this.xBound){
            xShift = this.xBound;
        }
        
        if(yShift > 0){
            yShift = 0;
        } else if(yShift < this.yBound){
            yShift = this.yBound;
        }
        
        this.draw.translate(xShift, yShift);
    },
    resetTranslate : function(){
        this.draw.restore();
    },
    setColor : function(color){
        this.draw.fillStyle = color;
    },
    shape : function(coords){
        /*
         * Coords is an array of arrays of 2 integers,
         * the x and y coordinates of each edge of the
         * shape you're drawing
         */
        this.draw.beginPath();
        this.draw.moveTo(coords[0][0], coords[0][1]);
        //skip the first point
        for(var i = 1; i < coords.length; i++){
            this.draw.lineTo(coords[i][0], coords[i][1]);
        }
        this.draw.fill();
    },
    testShape : function(sides){
        var coords = [];
        for(var i = 0; i < 2 * Math.PI; i += 2 * Math.PI / sides){
            coords.push([this.width / 2 + (this.width / 2 * Math.cos(i)), this.height / 2 - (this.height / 2 * Math.sin(i))]);
        }
        this.setColor("red");
        this.shape(coords);
    },
    rect : function(x, y, w, h){
        this.draw.fillRect(x, y, w, h);
    },
    circle : function(upperLeftX, upperLeftY, diameter){
        this.draw.beginPath();
        this.draw.arc(upperLeftX + diameter / 2, upperLeftY + diameter / 2, diameter / 2, 0, 2 * Math.PI);
        this.draw.fill();
    },
    triangle : function(x1, y1, x2, y2, x3, y3){
        this.shape([
            [x1, y1],
            [x2, y2],
            [x3, y3]
        ]);
    },
    drawGear : function(x, y, width, color, rotated){
        //add sprite class, change to "drawSprite"
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
        this.setColor(color);

        for (var row = 0; row < gear_map.length; row++) {
            for (var column = 0; column < gear_map[row].length; column++){
                if (gear_map[row][column] !== 0){
                    this.rect(x + size * row, y + size * column, size, size);
                }	
            }
        }
    },
    clear : function(){
        this.setColor("white");
        this.rect(0, 0, this.width, this.height);
    }
};


// Colors
// rename these        	
var color1 = "rgb(150, 50, 0)";
var color2 = "rgb(35, 100, 0)";
var color3 = "rgb(175, 175, 255)";
var energy_color = "rgb(155, 255, 0)";

var block_colors = [
    [gold(4), color1],
    [color1, color2],
    [silver(8), color3],
    [silver(4), silver(9)],
    [silver(3), silver(4)],
    [gold(4), gold(9)]
];

function load_page() {
    var body = document.getElementById("body");
    var canvas = document.getElementById("canvas");
    canvas.width = canvas_size;
    canvas.height = canvas_size;
}