var BLOCK_SIZE = 100;
function Block(c, x, y, can_hit) {
    this.c = c;
    this.x = x * BLOCK_SIZE;
    this.y = y * BLOCK_SIZE;
    this.can_hit = can_hit;
}
// Class methods
Block.prototype = {

    draw:function(){
        var shift = BLOCK_SIZE / 10;
        canvas.fillStyle = this.c[0];
        canvas.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
        if (!this.can_hit){return};
        canvas.fillStyle = this.c[1];
        canvas.fillRect(this.x + shift, this.y + shift, BLOCK_SIZE - shift * 2, BLOCK_SIZE - shift * 2);	
    },

    topColl:function(entity) {
        if(!entity.isWithin(this.x, this.y + 1, this.x + BLOCK_SIZE, this.y + BLOCK_SIZE)){
            // not just clipping the side
            if(entity.isWithin(
                this.x + 1,
                this.y - BLOCK_SIZE,
                this.x + BLOCK_SIZE - 1,
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

    bottom_coll:function(entity){
        if(entity.isWithin(
            this.x,
            this.y + BLOCK_SIZE / 2,
            this.x + BLOCK_SIZE,
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
        this.bottom_coll(entity);
    }	
}