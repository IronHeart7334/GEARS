/*
 * The Player class is used to construct the player object initialized by the HTML page
 */
function Player() {
    Entity.call(this);
    this.setWidth(BLOCK_SIZE * 0.9);
    this.setHeight(BLOCK_SIZE * 0.9);
    this.facingMod = 1; // 1: right, -1: left
    this.moving = false; // moving left or right
    
    this.falling = true; // used to determine if this is allowed to move left or right
    
    this.jumping = false; // if this Player is in the middle of jumping
    this.timeInJump = 0; // number of frames it has been jumping for
    this.jumpX = 0; // total x distance that will be traveled when this finishes jumping
    this.jumpY = 0; // total y
    
    this.speed = blocksPerSecond(3);
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

        this.gears = [];
        this.currentGearIndex = -1;
    },
    load : function(x, y){
        this.setCoords(x, y); //defined by Entity
        this.spawnCoords = [x, y];
    },
    respawn:function() {
        //invoked upon going below the map
        this.setCoords(this.spawnCoords[0], this.spawnCoords[1]);
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
    obtainGear:function(gear) {
        //TODO: maybe make it copy gear data?
        this.gears.push(gear);
        this.currentGearIndex = this.gears.indexOf(gear);
    },
    
    shiftGear:function() {
        // changes the currently selected gear
        if(this.gears.length === 0){
            console.log("Has no gears!");
        } else if (this.currentGearIndex < this.gears.length - 1){
            this.currentGearIndex ++;
        } else {
            this.currentGearIndex = 0;
        }
    },
    
    jump : function() {
        //initiates a jump
        if(this.gears.length === 0){
            console.log("No gears");
        } else if (!this.falling) {
            this.jumping = true;
            // the total amount moved after jumping
            this.jumpX = this.gears[this.currentGearIndex].xMom * BLOCK_SIZE;
            this.jumpY = this.gears[this.currentGearIndex].yMom * BLOCK_SIZE;
        }
    },
    updateJump : function(){
        var jumpTime = FPS / 2; //time it takes to finish jump
        this.moveX(this.jumpX * this.facingMod / jumpTime);
        this.moveY(-this.jumpY / jumpTime);
        this.timeInJump++;
        if(this.timeInJump >= jumpTime){
            this.timeInJump = 0;
            this.jumping = false;
            this.jumpX = 0;
            this.jumpY = 0;
        }
    },
    
    //TODO: do we want to be able to move while jumping?
    update:function() {
        if(this.falling){
            this.fall();
        }
        if(this.jumping){
            this.updateJump();
        } else if(this.moving && !this.falling){
            //no moving in midair
            this.moveX(this.speed * this.facingMod);
        }
        this.falling = true;
        if(this.y >= current_level.areas[current_level.currentArea].height){
            //respawn if we fall off the map
            this.respawn();
        }
    },
    
    drawHitbox:function(){
        canvas.fillStyle = "rgb(255, 255, 255)";
        canvas.fillRect(this.x, this.y, this.width, this.height);
    },
    
    draw:function() {
        this.drawHitbox();
        
        // torso
        var torso_size = this.width * 0.5;
        canvas.fillStyle = silver(5);
        if (this.facingMod === -1){
            canvas.fillRect(this.x, this.y - torso_size / 2, torso_size, torso_size);
        } else {
            canvas.fillRect(this.x - BLOCK_SIZE / 2, this.y - torso_size / 2, torso_size, torso_size);
        }
        
        // treads
        var tread_shift = 20;
        var treadY = this.y + tread_shift;
        var tread_width = BLOCK_SIZE;
        
        canvas.fillStyle = "rgb(0, 0, 0)";
        canvas.beginPath();
        canvas.moveTo(this.x, treadY);
        canvas.lineTo(this.x - tread_width / 2, this.y + BLOCK_SIZE / 2);
        canvas.lineTo(this.x + tread_width / 2, this.y + BLOCK_SIZE / 2);
        canvas.fill();
        
        // arms
        canvas.fillStyle = silver(7);
        canvas.fillRect(this.x, this.y, (BLOCK_SIZE / 3) * this.facingMod, BLOCK_SIZE / 5);
        
        // head
        canvas.fillStyle = silver(6);
        canvas.fillRect(this.x - BLOCK_SIZE / 4, this.y - BLOCK_SIZE / 2, BLOCK_SIZE / 2, BLOCK_SIZE / 4);
    },
    
    show_gear:function() {
        if (this.gears.length > 0){
            drawGear(0, canvas_size * 0.9, canvas_size * 0.1, this.gears[this.currentGearIndex].color, false);  
        }
    },
    
    drawHUD:function() {
        this.show_gear();
    }
};

extend(Player, Entity);