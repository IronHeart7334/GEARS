/*
 * The Canvas class is used to more easily perform opperations on an HTML canvas.
 *
 * USAGE:
 *
 * first, define the canvas object using the standard "var c = new Canvas()"
 *
 * once your HTML is loaded, you can then link the object to the canvas, via
 * "c.link(document.getElementById(...))"
 * at which point, you can now access the canvas element by using "c.linked"
 * or "c.draw" if you want to access the 2d context for drawing.
 *
 * the setContentSize method is used to control how much the canvas can translate
 *
 * setFocus is used to change where the canvas translates to, making the focus point the new origin
 *
 * setOffsets is used for defining where the canvas' focal point will appear on the canvas,
 * use setOffsets(c.width / 2, c.height / 2) to put it in the center of the canvas
 *
 * use updateTranslate to translate the canvas to where it is focusing on its focal point,
 * but shifted by the canvas' offsets. The translation will be constrained by the parameters set by setContentSize
 * EXAMPLE:
 *      var c = new Canvas();
 *      c.link(...);
 *      //width of 1000, height of 500
 *      c.setContentSize(500, 500);
 *      c.setFocus(250, 250);
 *      c.setOffsets(100, 100);
 *      c.updateTranslate();
 *
 *  will translate the canvas to (-150, -150),
 *  but since that is outside the content of the canvas (0 to 1000, 0 to 500),
 *  it will be translated to (0, 0) instead.
 *  Since the canvas' height and its content height are the same, it will never translate along the y axis
 */

var canvas_size = 700; //used to create the canvas

/*
 *TODO:
 *  Sprite class
 *  Color class
 *  Get rid of canvas_size global
 */

class Canvas{
    constructor(){
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
    link(elementId){
        // links this object to a canvas, if it exists
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
    }
    setContentSize(w, h){
        //how much this should be allowed to translate
        this.xBound = this.width - w;
        this.yBound = this.height - h;
    }
    setOffsets(x, y){
        this.xOffset = x;
        this.yOffset = y;
    }
    setFocus(x, y){
        this.focusX = x;
        this.focusY = y;
    }
    updateTranslate(){
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
    }
    resetTranslate(){
        this.draw.restore();
    }
    setColor(color){
        this.draw.fillStyle = color;
    }
    shape(coords){
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
    }
    testShape(sides){
        var coords = [];
        for(var i = 0; i < 2 * Math.PI; i += 2 * Math.PI / sides){
            coords.push([this.width / 2 + (this.width / 2 * Math.cos(i)), this.height / 2 - (this.height / 2 * Math.sin(i))]);
        }
        this.setColor("red");
        this.shape(coords);
    }
    rect(x, y, w, h){
        this.draw.fillRect(x, y, w, h);
    }
    circle(upperLeftX, upperLeftY, diameter){
        this.draw.beginPath();
        this.draw.arc(upperLeftX + diameter / 2, upperLeftY + diameter / 2, diameter / 2, 0, 2 * Math.PI);
        this.draw.fill();
    }
    triangle(x1, y1, x2, y2, x3, y3){
        this.shape([
            [x1, y1],
            [x2, y2],
            [x3, y3]
        ]);
    }
    drawGear(x, y, width, color, rotated){
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
    }
    clear(){
        this.setColor("white");
        this.rect(0, 0, this.width, this.height);
    }
};

function load_page() {
    var canvas = document.getElementById("canvas");
    canvas.width = canvas_size;
    canvas.height = canvas_size;
}
