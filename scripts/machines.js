// Machine Classes
function Gear(x, y, jump){
    this.x = x * BLOCK_SIZE + BLOCK_SIZE / 2;
    this.y = y * BLOCK_SIZE + BLOCK_SIZE / 2;
    this.jump = jump;
    this.rotated = false;
}

function Generator(x, y) {
    this.x = x * BLOCK_SIZE;
    this.y = y * BLOCK_SIZE;
}

function Door(x, y) {
    this.x = x * BLOCK_SIZE;
    this.y = y * BLOCK_SIZE;
    this.powered = false;
}

function Belt(x, y, width, direction, speed, auto_on){
    this.x = x * BLOCK_SIZE;
    this.y = y * BLOCK_SIZE;
    this.width = width * BLOCK_SIZE;
    this.direction = direction;
    this.speed = speed;
    this.auto_on = auto_on;
}

function Tram(x, y, destinations, auto_on){
    this.x = x * BLOCK_SIZE;
    this.y = y * BLOCK_SIZE;
    this.auto_on = auto_on;
    this.destinations = [];
    for (dest of destinations){
        this.destinations.push([dest[0] * BLOCK_SIZE, dest[1] * BLOCK_SIZE]);
    }
    this.destinations.push([this.x, this.y]);
    this.dest_num = 0;
    this.ready = true;
    this.moving = false;
}

// not finished
function Train(x, y, width, gears){
    this.x = x * BLOCK_SIZE;
    this.y = y * BLOCK_SIZE;
    this.width = width * BLOCK_SIZE;
    this.gears = gears;
}
// Machine methods
Gear.prototype = {
    draw:function(){
        if (this.jump == "none"){
            this.jump.color = silver(7);
        }
        draw_gear(this.x - BLOCK_SIZE / 4, this.y - BLOCK_SIZE / 4, BLOCK_SIZE / 10, this.jump.color, this.rotated);
    },
    
    update:function(){
        /*
        if (this.rotated){
            this.rotated = false;	
        }
        if (!this.rotated){
            this.rotated = true;
        }
        */
        if (player.x >= this.x - BLOCK_SIZE / 2 && player.x <= this.x + BLOCK_SIZE / 2 && player.y >= this.y - BLOCK_SIZE / 2 && player.y <= this.y + BLOCK_SIZE / 2) {
            player.obtain_gear(this.jump);
            
            if (this.jump == "none"){
                player.gear_count ++;
            }
            
            var to_remove = current_level.machines.indexOf(this);
            current_level.current_machines.splice(to_remove, 1);
            current_level.machines.splice(to_remove, 1);
        }
    }
}

Generator.prototype = {
    draw:function() {
        canvas.fillStyle = silver(7);
        canvas.fillRect(this.x + BLOCK_SIZE * 0.1, this.y - BLOCK_SIZE, BLOCK_SIZE * 0.8, BLOCK_SIZE * 2);
        
        canvas.fillStyle = silver(4);
        canvas.fillRect(this.x, this.y - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE / 2);
        canvas.fillRect(this.x, this.y + BLOCK_SIZE / 2, BLOCK_SIZE, BLOCK_SIZE / 2);
        
        canvas.fillStyle = energy_color;
        canvas.fillRect(this.x + BLOCK_SIZE * 0.4, this.y - BLOCK_SIZE / 2, BLOCK_SIZE / 5, BLOCK_SIZE);
    },
    
    update:function() {
        current_level.add_energy(this.x + BLOCK_SIZE, this.y);
    }
}

Door.prototype = {
    check_coll:function(object) {
        while (object.y >= this.y && object.y <= this.y + BLOCK_SIZE && object.x >= this.x + BLOCK_SIZE && object.x <= this.x + BLOCK_SIZE * 1.5){
            object.x += 1;
        }

        while (object.y >= this.y && object.y <= this.y + BLOCK_SIZE && object.x + BLOCK_SIZE / 2 >= this.x && object.x <= this.x + BLOCK_SIZE / 2){
            object.x -= 1;
        }
    },
    
    draw:function() {
        if (!this.powered){
            canvas.fillStyle = silver(6);
            canvas.fillRect(this.x + BLOCK_SIZE / 10, this.y, BLOCK_SIZE * 0.8, BLOCK_SIZE);
        
            canvas.fillStyle = "rgb(0, 0, 0)";
            canvas.fillRect(this.x + BLOCK_SIZE / 10, this.y + BLOCK_SIZE / 2, BLOCK_SIZE * 0.8, 1);
        }

        canvas.fillStyle = silver(2);
        canvas.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE / 10);
        canvas.fillRect(this.x, this.y + BLOCK_SIZE * 0.9, BLOCK_SIZE, BLOCK_SIZE / 10);
    },
    
    update:function() {
        if (!this.powered){
            this.check_coll(player);
        }
    }
     
}

Belt.prototype = {
    check_coll:function(object) {
        if (object.x > this.x && object.x < this.x + this.width && object.y + BLOCK_SIZE / 2 >= this.y && object.y + BLOCK_SIZE / 2 < this.y + BLOCK_SIZE){
            object.falling = false;
            object.y = this.y - BLOCK_SIZE / 2;
            
            if (!this.auto_on && !this.powered){return;}
            
            if (this.direction == "left") {
                object.x -= this.speed;
            }
            if (this.direction == "right") {
                object.x += this.speed;
            }
        }
    },
    
    draw:function() {
        canvas.fillStyle = "rgb(0, 0, 0)";
        canvas.fillRect(this.x, this.y, this.width, BLOCK_SIZE / 2);
        
        canvas.fillStyle = silver(7);
        canvas.beginPath();
        canvas.arc(this.x, this.y + BLOCK_SIZE / 4, BLOCK_SIZE /4 , 0, 2 * Math.PI);
        canvas.fill();
        
        canvas.beginPath();
        canvas.arc(this.x + this.width, this.y + BLOCK_SIZE / 4, BLOCK_SIZE /4 , 0, 2 * Math.PI);
        canvas.fill();
    },
    
    update:function() {
        this.check_coll(player);
    }
}

Tram.prototype = {
    draw:function(){
        canvas.fillStyle = silver(7);
        canvas.fillRect(this.x + BLOCK_SIZE / 4, this.y, BLOCK_SIZE / 2, BLOCK_SIZE);
        canvas.fillRect(this.x, this.y + BLOCK_SIZE * 0.75, BLOCK_SIZE, BLOCK_SIZE / 4);
        
        if (!this.auto_on && !this.powered){return;}
        
        canvas.fillStyle = energy_color;
        canvas.fillRect(this.x, this.y + BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE / 20);
    },
    
    update:function(){
        if (this.moving){
            this.follow_path();
            this.powered = true;
        }
        if (!this.powered && !this.auto_on){return;}
        
        if (!this.ready){return;}
        
        if (!player.magnetic){return;}
        
        if (player.x >= this.x && player.x <= this.x + BLOCK_SIZE && player.y > this.y + BLOCK_SIZE * 1.5){
            player.y -= GRAVITY * 2;
           // player.falling = false;
            if (player.y > this.y + BLOCK_SIZE * 1.5){return;}
            player.x = this.x + BLOCK_SIZE / 2;
            this.moving = true;
        }
    },
    
    follow_path:function(){
        this.current_dest = this.destinations[this.dest_num];
        
        if (this.x > this.current_dest[0]){
            this.x -= 5;
        }
         if (this.x < this.current_dest[0]){
            this.x += 5;
        }
        if (this.y > this.current_dest[1]){
            this.y -= 5;
        }
        if (this.y < this.current_dest[1]){
            this.y += 5;
        }
        else if (this.x == this.current_dest[0] && this.y == this.current_dest[1]){
            this.dest_num ++;
            if (this.dest_num + 1 == this.destinations.length){
                this.ready = false;
            }
            if (this.dest_num == this.destinations.length){
                this.dest_num = 0;
                this.ready = true;
                this.moving = false;
            }
        }
    }
}

// not finished
Train.prototype = {
    draw:function(){
        canvas.fillStyle = silver(4);
        canvas.fillRect(this.x, this.y, this.width, BLOCK_SIZE);
        
        for (gear of this.gears){
            if (gear) {
                draw_gear(this.x + this.gears.indexOf(gear) * BLOCK_SIZE, this.y, BLOCK_SIZE / 5, silver(2), true);
            }
        }
    },
    
    update:function(){
        return;
    }
}