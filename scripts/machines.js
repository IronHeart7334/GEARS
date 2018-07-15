// Machine Classes
function Gear(x, y, jump){
    this.x = x * block_size + block_size / 2;
    this.y = y * block_size + block_size / 2;
    this.jump = jump;
    this.rotated = false;
}

function Generator(x, y) {
    this.x = x * block_size;
    this.y = y * block_size;
}

function Door(x, y) {
    this.x = x * block_size;
    this.y = y * block_size;
    this.powered = false;
}

function Belt(x, y, width, direction, speed, auto_on){
    this.x = x * block_size;
    this.y = y * block_size;
    this.width = width * block_size;
    this.direction = direction;
    this.speed = speed;
    this.auto_on = auto_on;
}

function Tram(x, y, destinations, auto_on){
    this.x = x * block_size;
    this.y = y * block_size;
    this.auto_on = auto_on;
    this.destinations = [];
    for (dest of destinations){
        this.destinations.push([dest[0] * block_size, dest[1] * block_size]);
    }
    this.destinations.push([this.x, this.y]);
    this.dest_num = 0;
    this.ready = true;
    this.moving = false;
}

// not finished
function Train(x, y, width, gears){
    this.x = x * block_size;
    this.y = y * block_size;
    this.width = width * block_size;
    this.gears = gears;
}
// Machine methods
Gear.prototype = {
    draw:function(){
        if (this.jump == "none"){
            this.jump.color = silver(7);
        }
        draw_gear(this.x - block_size / 4, this.y - block_size / 4, block_size / 10, this.jump.color, this.rotated);
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
        if (player.x >= this.x - block_size / 2 && player.x <= this.x + block_size / 2 && player.y >= this.y - block_size / 2 && player.y <= this.y + block_size / 2) {
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
        canvas.fillRect(this.x + block_size * 0.1, this.y - block_size, block_size * 0.8, block_size * 2);
        
        canvas.fillStyle = silver(4);
        canvas.fillRect(this.x, this.y - block_size, block_size, block_size / 2);
        canvas.fillRect(this.x, this.y + block_size / 2, block_size, block_size / 2);
        
        canvas.fillStyle = energy_color;
        canvas.fillRect(this.x + block_size * 0.4, this.y - block_size / 2, block_size / 5, block_size);
    },
    
    update:function() {
        current_level.add_energy(this.x + block_size, this.y);
    }
}

Door.prototype = {
    check_coll:function(object) {
        while (object.y >= this.y && object.y <= this.y + block_size && object.x >= this.x + block_size && object.x <= this.x + block_size * 1.5){
            object.x += 1;
        }

        while (object.y >= this.y && object.y <= this.y + block_size && object.x + block_size / 2 >= this.x && object.x <= this.x + block_size / 2){
            object.x -= 1;
        }
    },
    
    draw:function() {
        if (!this.powered){
            canvas.fillStyle = silver(6);
            canvas.fillRect(this.x + block_size / 10, this.y, block_size * 0.8, block_size);
        
            canvas.fillStyle = "rgb(0, 0, 0)";
            canvas.fillRect(this.x + block_size / 10, this.y + block_size / 2, block_size * 0.8, 1);
        }

        canvas.fillStyle = silver(2);
        canvas.fillRect(this.x, this.y, block_size, block_size / 10);
        canvas.fillRect(this.x, this.y + block_size * 0.9, block_size, block_size / 10);
    },
    
    update:function() {
        if (!this.powered){
            this.check_coll(player);
        }
    }
     
}

Belt.prototype = {
    check_coll:function(object) {
        if (object.x > this.x && object.x < this.x + this.width && object.y + block_size / 2 >= this.y && object.y + block_size / 2 < this.y + block_size){
            object.falling = false;
            object.y = this.y - block_size / 2;
            
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
        canvas.fillRect(this.x, this.y, this.width, block_size / 2);
        
        canvas.fillStyle = silver(7);
        canvas.beginPath();
        canvas.arc(this.x, this.y + block_size / 4, block_size /4 , 0, 2 * Math.PI);
        canvas.fill();
        
        canvas.beginPath();
        canvas.arc(this.x + this.width, this.y + block_size / 4, block_size /4 , 0, 2 * Math.PI);
        canvas.fill();
    },
    
    update:function() {
        this.check_coll(player);
    }
}

Tram.prototype = {
    draw:function(){
        canvas.fillStyle = silver(7);
        canvas.fillRect(this.x + block_size / 4, this.y, block_size / 2, block_size);
        canvas.fillRect(this.x, this.y + block_size * 0.75, block_size, block_size / 4);
        
        if (!this.auto_on && !this.powered){return;}
        
        canvas.fillStyle = energy_color;
        canvas.fillRect(this.x, this.y + block_size, block_size, block_size / 20);
    },
    
    update:function(){
        if (this.moving){
            this.follow_path();
            this.powered = true;
        }
        if (!this.powered && !this.auto_on){return;}
        
        if (!this.ready){return;}
        
        if (!player.magnetic){return;}
        
        if (player.x >= this.x && player.x <= this.x + block_size && player.y > this.y + block_size * 1.5){
            player.y -= GRAVITY;
            player.falling = false;
            if (player.y > this.y + block_size * 1.5){return;}
            player.x = this.x + block_size / 2;
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
        canvas.fillRect(this.x, this.y, this.width, block_size);
        
        for (gear of this.gears){
            if (gear) {
                draw_gear(this.x + this.gears.indexOf(gear) * block_size, this.y, block_size / 5, silver(2), true);
            }
        }
    },
    
    update:function(){
        return;
    }
}