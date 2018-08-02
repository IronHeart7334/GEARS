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
    this.baseColor = baseColor;
    this.rimColor = rimColor;
    this.x = x * BLOCK_SIZE;
    this.y = y * BLOCK_SIZE;
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
                this.x + BLOCK_SIZE / 2,
                this.y + BLOCK_SIZE / 2
                )
            ){
                ret = true;
                entity.falling = false; //TODO: individual collisions reactions per entity
                entity.y = this.y - BLOCK_SIZE / 2;
            }
        } else {
            console.log("no top collide b/c left or right");
        }
        return ret;
    },
    //buggy
    bottomColl:function(entity){
        if(entity.isWithin(
            this.x - 1,
            this.y + BLOCK_SIZE / 2,
            this.x + BLOCK_SIZE + 1,
            this.y + BLOCK_SIZE * 1.5
        )){
            console.log("clunk");
            entity.y = this.y + BLOCK_SIZE * 1.5;
        } 
    },
    leftColl:function(entity) {
        if(entity.isWithin(
            this.x,
            this.y,
            this.x + BLOCK_SIZE / 2,
            this.y + BLOCK_SIZE
        )){
            entity.x = this.x - BLOCK_SIZE / 2;
        }
    },
    rightColl:function(entity) {
        if(entity.isWithin(
            this.x + BLOCK_SIZE / 2,
            this.y,
            this.x + BLOCK_SIZE,
            this.y + BLOCK_SIZE
        )){
            entity.x = this.x + BLOCK_SIZE * 1.5;
        }
    },
    checkColl(entity){
        this.bottomColl(entity);
        this.leftColl(entity);
        this.rightColl(entity);
        this.topColl(entity);
    }	
}


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