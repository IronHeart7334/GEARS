//redo this
var base_canvas;
var canvas;
var canvas_size = 700;
var camera_shift = [canvas_size / 2, canvas_size * 0.67];


var canvas2 = {
    linked : null,
    width : 0,
    height : 0,
    xBound : 0,
    yBound : 0,
    setSize : function(w, h){
        this.width = w;
        this.height = h;
        this.xBound = w;
        this.yBound = h;
    },
    setContentSize : function(x, y){
        //the most the canvas can be translated by
        this.xBound = this.width - x;
        this.yBound = this.height - y;
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

// Camera functions

function update_camera() {
    canvas.save();
    var x_shift = -player.x + camera_shift[0];
    var y_shift = -player.y + camera_shift[1];

            // left
    if (x_shift > 0){
        x_shift = 0;
    }

    // right
    if (x_shift < canvas_size - current_level.areas[current_level.currentArea].width) {
        x_shift = canvas_size - current_level.areas[current_level.currentArea].width;
    }

    // top
    if (y_shift > 0){
        y_shift = 0;
    }

    // bottom
    if (y_shift < canvas_size - current_level.areas[current_level.currentArea].height){
        y_shift = canvas_size - current_level.areas[current_level.currentArea].height;
    }

    canvas.translate(x_shift, y_shift);
}

function reset_camera() {
    canvas.restore();
}

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