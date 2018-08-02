function Player() {
    this.facingMod = 1; // 1: right, -1: left
    this.x = 0;
    this.y = 0;
    this.moving = false; // moving left or right
    this.arm_shift = 0;
    
    this.falling = true;
    this.jumping = false;
    this.timeInJump = 0;
    this.jumpX = 0;
    this.jumpY = 0;
    
    this.magnetic = true;
    
    this.speed = blocksPerSecond(2);
}
Player.prototype = {
    init : function(x, y){
        this.load(x, y);
        this.facingMod = 1;
        this.moving = false;
        this.falling = true;
        this.jumping = false;
        this.timeInJump = 0;
        this.jumpX = 0;
        this.jumpY = 0;
        
        this.gears = ["none"];
        this.current_gear = 0;
        this.gear_count = 0;
    },
    
    load : function(x, y){
        this.x = x;
        this.y = y;
        this.spawn_coords = [x, y];
    },
    
    move : function(x, y){
        this.x += x;
        this.y += y;
    },
    moveX : function(x) {
        this.x += x;
    },
    moveY : function(y) {
        this.y += y;
    },
    respawn:function() {
        this.x = this.spawn_coords[0];
        this.y = this.spawn_coords[1];
        this.jumpX = 0;
        this.jumpY = 0;
    },
    fall:function() {
        // don't mess with my jumping
        if(!this.jumping){
            this.moveY(GRAVITY);
        }
    },
    
    moveLeft:function() {
        // notifies the player to move left
        this.facingMod = -1;
        this.moving = true;
    },
    moveRight:function() {
        this.facingMod = 1;
        this.moving = true;
    },
    stop : function(){
        this.moving = false;
    },
    isWithin : function(x1, y1, x2, y2){
        /*
        x1, y1: upper left corner
        x2, y2: lower right
        */
        return (
            (this.x + BLOCK_SIZE / 2 >= x1) &&
            (this.y - BLOCK_SIZE / 2 >= y1) &&
            (this.x - BLOCK_SIZE / 2 <= x2) &&
            (this.y + BLOCK_SIZE / 2 <= y2)
        );
    },
    
    obtain_gear:function(gear) {
        var found = false;
        for (g of this.gears){
            if (g === gear) {
                found = true;
            }
        }
        if(!found){
            this.gears.push(gear);
        }
        this.current_gear = this.gears.indexOf(gear);
    },
    
    shiftGear:function() {
        if (this.current_gear < this.gears.length - 1){
            this.current_gear ++;
        } else {this.current_gear = 0;}
    },
    
    jump : function() {
        if (this.gears[this.current_gear] != "none" && !this.falling) {
            this.jumping = true;
            // the total amount moved after jumping
            this.jumpX = this.gears[this.current_gear].xMom * BLOCK_SIZE;
            this.jumpY = this.gears[this.current_gear].yMom * BLOCK_SIZE;
        } else {console.log("no gear");}
    },
    updateJump : function(){
        var jumpTime = FPS / 2; //time it takes to finish jump
        this.x += this.jumpX * this.facingMod / jumpTime;
        this.y -= this.jumpY / jumpTime;
        this.timeInJump++;
        if(this.timeInJump >= jumpTime){
            this.timeInJump = 0;
            this.jumping = false;
            this.jumpX = 0;
            this.jumpY = 0;
        }
    },
    
    update:function() {
        if(this.falling){
            this.fall();
        }
        if(this.jumping){
            this.updateJump();
        } else if(this.moving && !this.falling){
            //no moving in midair
            this.moveX((BLOCK_SIZE / FPS) * this.speed * this.facingMod);
        }
        this.falling = true;
        if(this.y >= current_level.height_in_px){
            this.respawn();
        }
    },
    
    draw_torso:function() {
        var torso_size = BLOCK_SIZE * 0.5;
        canvas.fillStyle = silver(5);
        if (this.facingMod === -1){
            canvas.fillRect(this.x, this.y - torso_size / 2, torso_size, torso_size);
        } else {
            canvas.fillRect(this.x - BLOCK_SIZE / 2, this.y - torso_size / 2, torso_size, torso_size);
        }
        
    },
    
    draw_treads:function(){
        var tread_shift = 20;
        var treadY = this.y + tread_shift;
        var tread_width = BLOCK_SIZE;
        
        canvas.fillStyle = "rgb(0, 0, 0)";
        canvas.beginPath();
        canvas.moveTo(this.x, treadY);
        canvas.lineTo(this.x - tread_width / 2, this.y + BLOCK_SIZE / 2);
        canvas.lineTo(this.x + tread_width / 2, this.y + BLOCK_SIZE / 2);
        canvas.fill();
    },
    
    draw_arms:function(){
        canvas.fillStyle = silver(7);
        canvas.fillRect(this.x + this.arm_shift, this.y, (BLOCK_SIZE / 3) * this.facingMod, BLOCK_SIZE / 5);
    },
    
    draw_head:function(){
        canvas.fillStyle = silver(6);
        canvas.fillRect(this.x - BLOCK_SIZE / 4, this.y - BLOCK_SIZE / 2, BLOCK_SIZE / 2, BLOCK_SIZE / 4);
    },
    
    draw_hitbox:function(){
        canvas.fillStyle = "rgb(255, 255, 255)";
        canvas.fillRect(this.x - BLOCK_SIZE / 2, this.y - BLOCK_SIZE / 2, BLOCK_SIZE, BLOCK_SIZE);
    },
    
    draw:function() {
        //this.draw_hitbox();
        
        this.draw_torso();
        this.draw_treads();
        this.draw_arms();
        this.draw_head();
    },
    
    show_gear:function() {
        if (this.gears[this.current_gear] == "none"){return};
        drawGear(0, canvas_size * 0.9, canvas_size * 0.1, this.gears[this.current_gear].color, false);  
    },
    
    drawHUD:function() {
        this.show_gear();
    },
    
    reset_arm:function() {
        this.arm_shift = 0;
    }	
}