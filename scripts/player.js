function Player() {
    this.moveMod = 0;
    /*
    All movement is multipled by this.
    either 
    -1 (left),
    0 (not moving),
    or 1 (right)
    */
    this.x_mom = 0;
    this.y_mom = 0;
    this.arm_shift = 0;
    this.showHUD = true;
    
    this.magnetic = true;
    
    // values 3-7
    this.power_capacity = 5;
    this.speed = 5;
    this.power_consumption = 5;
}
Player.prototype = {
    load:function(x, y){
        this.x = x;
        this.y = y;
        this.spawn_coords = [x, y];
        this.moveMod = 0;
        this.facing = "right";
        this.gears = ["none"];
        this.current_gear = 0;
        this.gear_count = 0;
        this.power = this.power_capacity * POWER_MULT;
    },
    
    reset_x_mom:function() {
        this.x_mom = 0;
    },
    
    reset_y_mom:function() {
        this.y_mom = 0;
    },
    
    reset_mom:function() {
        this.reset_x_mom();
        this.reset_y_mom();
    },
    
    respawn:function() {
        this.x = this.spawn_coords[0];
        this.y = this.spawn_coords[1];
    },
    
    fall:function() {
        if(this.falling){
            this.y_mom += GRAVITY;
        }
    },
    
    moveLeft:function() {
        // notifies the player to move left
        this.moveMod = -1;
        this.facing = "left";
    },
    
    moveRight:function() {
        //this.x_mom = block_size / 20 * this.speed;
        this.moveMod = 1;
        this.facing = "right";
    },
    
    stop : function(){
        this.moveMod = 0;
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
    
    jump:function() {
        if (this.falling){return;}
        if (this.gears[this.current_gear] != "none") {
            if (this.facing == "left"){
                this.x_mom -= block_size * this.gears[this.current_gear].x_mom;
            }
            if (this.facing == "right"){
                this.x_mom += block_size * this.gears[this.current_gear].x_mom;
            }
            this.y_mom -= block_size * this.gears[this.current_gear].y_mom;
        } else {console.log("no gear");}
    },
    
    update:function() {
        this.fall();
        this.x_mom += (block_size / FPS) * this.speed * this.moveMod;
        this.x += this.x_mom;
        this.y += this.y_mom;
        this.falling = true;
        this.reset_mom();
        
        if(this.y >= current_level.height_in_px){
            this.respawn();
        }
    },
    
    draw_torso:function() {
        var torso_size = block_size * 0.5;
        
        canvas.fillStyle = silver(5);
        if (this.facing == "left"){
            canvas.fillRect(this.x, this.y - torso_size / 2, torso_size, torso_size);
        }
        if (this.facing == "right"){
            canvas.fillRect(this.x - block_size / 2, this.y - torso_size / 2, torso_size, torso_size);
        }
        
    },
    
    draw_treads:function(){
        var tread_shift = 20;
        var treadY = this.y + tread_shift;
        var tread_width = block_size;
        
        canvas.fillStyle = "rgb(0, 0, 0)";
        canvas.beginPath();
        canvas.moveTo(this.x, treadY);
        canvas.lineTo(this.x - tread_width / 2, this.y + block_size / 2);
        canvas.lineTo(this.x + tread_width / 2, this.y + block_size / 2);
        canvas.fill();
    },
    
    draw_arms:function(){
        canvas.fillStyle = silver(7);
        if (this.facing == "left"){
            canvas.fillRect(this.x + this.arm_shift, this.y, -block_size / 3, block_size / 5);
        }
        if (this.facing == "right"){
            canvas.fillRect(this.x + this.arm_shift, this.y, block_size / 3, block_size / 5);
        }
    },
    
    draw_head:function(){
        canvas.fillStyle = silver(6);
        canvas.fillRect(this.x - block_size / 4, this.y - block_size / 2, block_size / 2, block_size / 4);
    },
    
    draw_hitbox:function(){
        canvas.fillStyle = "rgb(255, 255, 255)";
        canvas.fillRect(this.x - block_size / 2, this.y - block_size / 2, block_size, block_size);
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
        draw_gear(canvas_size * 0.025, canvas_size * 0.925, 10, this.gears[this.current_gear].color, false);  
    },
    
    show_power:function() {
        canvas.fillStyle = silver(7);
        canvas.beginPath();
        canvas.arc(canvas_size * 0.25, canvas_size * 0.95, canvas_size / 40, 0, 2 * Math.PI);
        canvas.fill();
        
        canvas.fillStyle = silver(7);
        canvas.beginPath();
        canvas.arc(canvas_size * 0.75, canvas_size * 0.95, canvas_size / 40, 0, 2 * Math.PI);
        canvas.fill();
        
        canvas.fillStyle = energy_color;
        canvas.fillRect(canvas_size * 0.25, canvas_size * 0.925, (this.power / (this.power_capacity * POWER_MULT)) * canvas_size / 2, canvas_size / 20);
    },
    
    drawHUD:function() {
        if (this.showHUD){
            this.show_gear();
            this.show_power();
        }
    },
    
    reset_arm:function() {
        this.arm_shift = 0;
    }	
}