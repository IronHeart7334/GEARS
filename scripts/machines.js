// abstract base class for machines
// todo: add power methods
function Machine(x, y){
    this.x = x * BLOCK_SIZE;
    this.y = y * BLOCK_SIZE;
}
Machine.prototype = {
    draw : function(){
        var obj = this;
        throw new Error("No draw method found for " + obj);
    },
    collide : function(entity){
        //each subclass defines
    },
    checkForCollide : function(entity){
        var collide = false;
        if(entity.isWithin(this.x, this.y, this.x + BLOCK_SIZE, this.y + BLOCK_SIZE)){
            this.collide(entity);
            collide = true;
        }
        return collide;
    },
    update : function(){
        var obj = this;
        throw new Error("No update method found for " + obj);
    }
}

function Gear(x, y, jump){
    Machine.call(this, x, y);
    this.jump = jump;
    this.claimed = false;
    this.rotated = false;
    this.rotateCount = 0;
}
extend(Gear, Machine);
//need to define each seperately to prevent overwriting entire prototype
Gear.prototype.draw = function(){
    if(!this.claimed){
        drawGear(this.x, this.y, BLOCK_SIZE, this.jump.color, this.rotated);
    }
}
Gear.prototype.collide = function(entity){
    try{
        entity.obtain_gear(this.jump);
        this.claimed = true;
    } catch(e){
        //not a Player
    }
}
Gear.prototype.update = function(){
    if(!this.claimed){
        if(this.rotateCount === FPS){
            this.rotated = !this.rotated;
            this.rotateCount = 0;
        }
        this.rotateCount++;
    }
}



function Belt(x, y, width, movesRight, autoOn){
    Machine.call(this, x, y);
    this.width = width * BLOCK_SIZE;
    this.movesRight = movesRight;
    this.autoOn = autoOn;
}
extend(Belt, Machine);
Belt.prototype.checkForCollide = function(entity){
    var collide = false;
    if(entity.isWithin(this.x, this.y, this.x + this.width, this.y + BLOCK_SIZE)){
        collide = true;
        this.collide(entity);
    }
    return collide;
}
Belt.prototype.draw = function(){
    canvas.fillStyle = "rgb(0, 0, 0)";
    canvas.fillRect(this.x, this.y, this.width, BLOCK_SIZE / 2);

    canvas.fillStyle = silver(7);
    canvas.beginPath();
    canvas.arc(this.x, this.y + BLOCK_SIZE / 4, BLOCK_SIZE /4 , 0, 2 * Math.PI);
    canvas.fill();

    canvas.beginPath();
    canvas.arc(this.x + this.width, this.y + BLOCK_SIZE / 4, BLOCK_SIZE /4 , 0, 2 * Math.PI);
    canvas.fill();
}
Belt.prototype.collide = function(entity){
    var speed = blocksPerSecond(1);
    entity.y = this.y - BLOCK_SIZE / 2; // maybe add padding attribute to objects
    entity.falling = false;
    if(this.movesRight){
        entity.moveX(speed);
    } else {
        entity.moveX(-speed);
    }
}
Belt.prototype.update = function(){
    //do nothing
}



function Tram(x, y, destinations, autoOn){
    Machine.call(this, x, y);
    
}

// Machine Classes

function Generator(x, y) {
    this.x = x * BLOCK_SIZE;
    this.y = y * BLOCK_SIZE;
}

function Door(x, y) {
    this.x = x * BLOCK_SIZE;
    this.y = y * BLOCK_SIZE;
    this.powered = false;
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