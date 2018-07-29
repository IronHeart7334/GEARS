//works
function extend(constructor, superConstructor){
    var superProto = Object.create(superConstructor.prototype);
    for(var method in superProto){
        constructor.prototype[method] = superProto[method];
    }
}



// the base class for blocks
function Block(baseColor, rimColor, x, y) {
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
        if(!entity.isWithin(this.x, this.y + 1, this.x + BLOCK_SIZE, this.y + BLOCK_SIZE)){
            // not just clipping the side
            if(entity.isWithin(
                this.x + BLOCK_SIZE * 0.25,
                this.y - BLOCK_SIZE,
                this.x + BLOCK_SIZE / 2,
                this.y + BLOCK_SIZE / 2
                )
            ){
                entity.falling = false; //TODO: individual collisions reactions per entity
                entity.y = this.y - BLOCK_SIZE / 2;
            }
        } else {
            console.log("no top collide b/c left or right");
        }
    },
    //buggy
    bottomColl:function(entity){
        if(entity.isWithin(
            this.x - 1,
            this.y + BLOCK_SIZE / 2,
            this.x + BLOCK_SIZE + 1,
            this.y + BLOCK_SIZE * 1.5
        )){
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
        this.leftColl(entity);
        this.rightColl(entity);
        this.topColl(entity);
        this.bottomColl(entity);
    }	
}



function MetalBlock(x, y){
    Block.call(this, silver(4), silver(3), x, y);
}
extend(MetalBlock, Block);

function GoldBlock(x, y){
    Block.call(this, gold(10), gold(4), x, y);
}
extend(GoldBlock, Block);


function testAllColorFunction(f){
    //f is either silver or gold
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