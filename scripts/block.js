/*
The Block class is used to generate the platforms that the player interacts with.
*/

function Block(baseColor, rimColor, x, y) {
    /*
    baseColor: the color of this block
    rimColor: the color of the frame around the block
    x: the number of blocks between this one and the leftmost side of the area it is in
    y: the number of blocks above this one and the top of the area it is in
    */
    Entity.call(this);
    this.setCoords(x * BLOCK_SIZE, y * BLOCK_SIZE);
    this.baseColor = baseColor;
    this.rimColor = rimColor;
}
Block.prototype = {
    draw:function(){
        var shift = BLOCK_SIZE / 10;
        canvas.fillStyle = this.rimColor;
        canvas.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
        canvas.fillStyle = this.baseColor;
        canvas.fillRect(this.x + shift, this.y + shift, BLOCK_SIZE - shift * 2, BLOCK_SIZE - shift * 2);	
    },
    topColl:function(entity) {
        // returns whether or not entity is above this, though colliding with it,
        // also moves the entity to just above this and prevents it from falling
        
        var ret = false;
        if(!entity.isWithin(this.x, this.y + 1, this.x + BLOCK_SIZE, this.y + BLOCK_SIZE)){
            // not just clipping the side
            if(entity.isWithin(
                this.x + BLOCK_SIZE * 0.25,
                this.y - BLOCK_SIZE,
                this.x + BLOCK_SIZE * 0.75,
                this.y + BLOCK_SIZE / 2
                )
            ){
                ret = true;
                entity.falling = false; //TODO: individual collisions reactions per entity
                entity.y = this.y - entity.height;
            }
        } else {
            console.log("no top collide b/c left or right");
        }
        return ret;
    },
    //buggy
    bottomColl:function(entity){
        var ret = false;
        if(entity.isWithin(
            this.x - 1,
            this.y + BLOCK_SIZE / 2,
            this.x + BLOCK_SIZE + 1,
            this.y + this.height
        )){
            console.log("clunk");
            entity.y = this.y + this.height;
            ret = true;
        }
        return ret;
    },
    leftColl:function(entity) {
        var ret = false;
        if(entity.isWithin(
            this.x,
            this.y,
            this.x + BLOCK_SIZE / 2,
            this.y + BLOCK_SIZE
        )){
            entity.x = this.x - entity.width;
            ret = true;
        }
        return ret;
    },
    rightColl:function(entity) {
        var ret = false;
        if(entity.isWithin(
            this.x + BLOCK_SIZE / 2,
            this.y,
            this.x + BLOCK_SIZE,
            this.y + BLOCK_SIZE
        )){
            entity.x = this.x + entity.width;
            ret = true;
        }
        return ret;
    },
    shoveOut : function(entity){
        var xDiff = (entity.x + entity.width / 2) - (this.x + this.width / 2);
        var yDiff = (entity.y + entity.height / 2) - (this.y + this.height / 2);
        if(xDiff === 0){
            xDiff === yDiff; // prevent undefined
        }
        var tanTheta = -yDiff / xDiff;
        var angle = Math.atan(tanTheta);
        var degrees = 180 * angle / Math.PI;
        while(degrees < 0){
            degrees += 360;
        }
        console.log(degrees);
        if((xDiff === 0 && yDiff > 0) || between(45, degrees, 135)){
            //top
            entity.setY(this.y - entity.height);
            entity.falling = false;
        } else if((yDiff === 0 && xDiff < 0) || between(135, degrees, 225)){
            //left
            entity.setX(this.x - entity.width);
        } else if((yDiff === 0 && xDiff > 0) || (between(1, degrees, 45) || between(315, degrees, 360))){
            //right
            //console.log("right when angle = " + degrees);
            entity.setX(this.x + this.width);
        } else if((xDiff === 0 && yDiff < 0) || between(225, degrees, 315)){
            //bottom
            entity.setY(this.y + this.height);
        } else {
            console.log("? " + tanTheta);
        }
    },
    checkColl(entity){
        var ret = false;
        // since js short circuit evaluates, only 1 collision reaction will happen
        //nope. still not working. Need general "on collide" that checks for top, bottom, etc.
        /*
        if(this.topColl(entity) || this.bottomColl(entity) || this.leftColl(entity) || this.rightColl(entity)){
            ret = true;
        }*/
       if(this.checkForCollide(entity)){
           this.shoveOut(entity);
       }
        return ret;
    }	
};
extend(Block, Entity);


// subclasses
function MetalBlock(x, y){
    Block.call(this, silver(4), silver(3), x, y);
}
extend(MetalBlock, Block);

function GoldBlock(x, y){
    Block.call(this, gold(10), gold(4), x, y);
}
extend(GoldBlock, Block);


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
    
    for(var i = 0; i < 360; i++){
        //console.log(e.x + ", " + e.y);
        console.log(i + ":");
        var angle = Math.PI * i / 180;
        e.setCoords(Math.cos(angle), -Math.sin(angle));
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