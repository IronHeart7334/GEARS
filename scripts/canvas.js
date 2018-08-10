//redo this
var base_canvas;
var canvas;
var canvas_size = 700;

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
    clear : function(){
        this.draw.fillStyle = "white";
        this.draw.fillRect(0, 0, this.width, this.height);
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
    var fresh_canvas = document.createElement("canvas");
    fresh_canvas.id = "canvas";
    fresh_canvas.width = canvas_size;
    fresh_canvas.height = canvas_size;
    fresh_canvas.style.position = "absolute";
    fresh_canvas.style.top = "0px";
    fresh_canvas.style.left = "0px";
    body.appendChild(fresh_canvas);
    base_canvas = document.getElementById("canvas");
    canvas = base_canvas.getContext("2d");
}