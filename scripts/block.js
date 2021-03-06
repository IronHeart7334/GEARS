/*
The Block class is used to generate the platforms that the player interacts with.
*/

/*
 * TODO:
 * -change BLOCK_SIZE, don't want global. Maybe set in Game since it keeps track of the canvas size?
 * -maybe add special blocks i.e. IceBlock with special collide(entity) function that slips entities around?
 * -change to use Sprite instead of current block 'image'
 */

var BLOCK_SIZE = canvas_size / 10; //may want to redo this as a strict size

class Block extends Entity{
    constructor(baseColor, rimColor, x, y) {
      /*
      baseColor: the color of this block
      rimColor: the color of the frame around the block
      x: the number of blocks between this one and the leftmost side of the area it is in
      y: the number of blocks above this one and the top of the area it is in
      hasBlockAbove: whether or not there is a block directly above this one, if it is true,
                      then this won't make top collision checks to prevent wall climbing
      */
      super();
      this.setCoords(x * BLOCK_SIZE, y * BLOCK_SIZE);
      this.baseColor = baseColor;
      this.rimColor = rimColor;
      this.hasBlockAbove = false;
    }
    disableTop(){
        //prevents top collisions when there is a block above this one
        //invoked by Area
        this.hasBlockAbove = true;
    }
    draw(canvas){
        var shift = BLOCK_SIZE / 10;
        canvas.setColor(this.rimColor);
        canvas.rect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
        canvas.setColor(this.baseColor);
        canvas.rect(this.x + shift, this.y + shift, BLOCK_SIZE - shift * 2, BLOCK_SIZE - shift * 2);
    }
    shoveOut(entity){
        // yay! finally works!
        //
        // the end coordinates of a line between this and entity, but shifted to (0, 0)
        var xDiff = (entity.x + entity.width / 2) - (this.x + this.width / 2);
        var yDiff = (entity.y + entity.height / 2) - (this.y + this.height / 2);

        // the length of the sides of the triangle
        var x = Math.abs(xDiff);
        var y = Math.abs(yDiff);

        var alpha;

        if(x === 0){
            //prevent undefined
            alpha = 90;
        } else {
            alpha = Math.atan(y / x) * 180 / Math.PI;
        }

        var theta;
        //since I'm not performing trig after this, these are their angles on the canvas, NOT CARTESIAN
        if(xDiff > 0 && yDiff < 0){
            theta = alpha;
        } else if(xDiff < 0 && yDiff < 0){
            theta = 180 - alpha;
        } else if(xDiff < 0 && yDiff > 0){
            theta = 180 + alpha;
        } else {
            theta = 360 - alpha;
        }

        if(xDiff === 0){
            theta = (yDiff > 0) ? 270 : 90;
        }
        if(yDiff === 0){
            theta = (xDiff > 0) ? 0 : 180;
        }

        if(!this.hasBlockAbove && between(45, theta, 135)){
            //top
            entity.setY(this.y - entity.height);
            entity.falling = false;
        } else if(between(135, theta, 225)){
            //left
            entity.setX(this.x - entity.width);
        } else if((between(0, theta, 45) || between(315, theta, 360))){
            //right
            entity.setX(this.x + this.width);
        } else if(between(225, theta, 315)){
            //bottom
            entity.setY(this.y + this.height);
        } else {
            console.log("? " + theta);
        }
    }
    checkColl(entity){
        var ret = false;
        if(this.checkForCollide(entity)){
           this.shoveOut(entity);
           ret = true;
        }
        return ret;
    }
};

// subclasses
class MetalBlock extends Block{
    constructor(x, y){
      super(silver(4), silver(3), x, y);
    }
}

class GoldBlock extends Block{
    constructor(x, y){
      super(gold(10), gold(4), x, y);
    }
}

// test functions
function testAllColorFunction(f){
    //f is either silver or gold
    //tests all possible combinations of
    // f(1-10) for a block's main and rim colors
    pause();
    for(var i = 1; i < 11; i++){
        for(var j = 0; j < 11; j++){
            new Block(f(i), f(j), i - 1, j - 1).draw();
        }
    }
}
function testAllSilver(){
    testAllColorFunction(silver);
}
function testAllGold(){
    testAllColorFunction(gold);
}

function testShove(){
    var b = new GoldBlock(0, 0);
    var e = new Entity();

    var top = [];
    var bottom = [];
    var left = [];
    var right = [];

    console.log(b.x + ", " + b.y);
    for(var i = 0; i <= 360; i+=15){
        console.log(i + ":");
        var angle = Math.PI * i / 180;
        e.setCoords(Math.cos(angle), -Math.sin(angle));
        console.log(e.x + ", " + e.y);
        b.checkColl(e);
        if(e.y === b.y - b.height){
            top.push(i);
        } else if(e.y === b.y + b.height){
            bottom.push(i);
        } else if(e.x === b.x - e.width){
            left.push(i);
        } else if(e.x === b.x + b.width){
            right.push(i);
        }
    }
    console.log("Top: " + top);
    console.log("Bottom: " + bottom);
    console.log("Left: " + left);
    console.log("Right: " + right);
}
