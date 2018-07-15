// Class constructors
function Block(c, x, y, can_hit) {
    this.c = c;
    this.x = x * block_size;
    this.y = y * block_size;
    this.can_hit = can_hit;
}
// Class methods
Block.prototype = {

    draw:function(){
        var shift = block_size / 10;
        canvas.fillStyle = this.c[0];
        canvas.fillRect(this.x, this.y, block_size, block_size);
        if (!this.can_hit){return};
        canvas.fillStyle = this.c[1];
        canvas.fillRect(this.x + shift, this.y + shift, block_size - shift * 2, block_size - shift * 2);	
    },

    top_coll:function(object) {
        if (object.x + 1 > this.x && object.x - 1 < this.x + block_size && object.y + block_size / 2 >= this.y && object.y + block_size / 2 < this.y + block_size){
            object.falling = false;
            object.y = this.y - block_size / 2;
        }
    },

    bottom_coll:function(object){
        if (object.x > this.x && object.x < this.x + block_size && object.y - block_size / 2 > this.y && object.y - block_size / 2 < this.y + block_size){
            object.y = this.y + block_size * 1.5;
        } 
    },

    left_coll:function(object) {
        while (object.y >= this.y && object.y <= this.y + block_size && object.x >= this.x + block_size && object.x <= this.x + block_size * 1.5){
            object.x += 1;
        }
    },

    right_coll:function(object) {
        while (object.y >= this.y && object.y <= this.y + block_size && object.x + block_size / 2 >= this.x && object.x <= this.x + block_size / 2){
            object.x -= 1;
        }
    }	
}