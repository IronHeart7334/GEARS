// abstract base class for machines
// todo: add power methods
function Machine(x, y, autoOn){
    Entity.call(this);
    this.startX = x * BLOCK_SIZE;
    this.startY = y * BLOCK_SIZE;
    this.autoOn = autoOn;
}
Machine.prototype = {
    init : function(){
        this.x = this.startX;
        this.y = this.startY;
        this.powered = false;
    },
    isEnabled : function(){
        return this.powered || this.autoOn;
    },
    draw : function(){
        var obj = this;
        throw new Error("No draw method found for " + obj);
    },
    collide : function(entity){
        //each subclass defines
    },
    checkColl : function(entity){
        if(this.checkForCollide(entity)){
            this.collide(entity);
        }
    },
    update : function(){
        //defined by subclasses
    },
    checkIfUpdate : function(){
        if(this.isEnabled()){
            this.update();
        }
    }
};
extend(Machine, Entity);

function Gear(x, y, jump){
    Machine.call(this, x, y, true);
    this.jump = jump;
    this.claimed = false;
    this.rotated = false;
    this.rotateCount = 0;
}

Gear.prototype = {
    draw : function(){
        if(!this.claimed){
            drawGear(this.x, this.y, BLOCK_SIZE * 0.9, this.jump.color, this.rotated);
        }
    },
    collide : function(entity){
        try{
            if(!this.claimed){
                entity.obtainGear(this.jump);
                this.claimed = true;
            }
        } catch(e){
            //not a Player
            console.log(e.stack);
        }
    },
    update : function(){
        if(!this.claimed){
            if(this.rotateCount === FPS){
                this.rotated = !this.rotated;
                this.rotateCount = 0;
            }
            this.rotateCount++;
        }
    }
}
extend(Gear, Machine);


function Belt(x, y, width, movesRight, autoOn){
    Machine.call(this, x, y, autoOn);
    this.setWidth(width * BLOCK_SIZE);
    this.movesRight = movesRight;
}
Belt.prototype = {
    draw : function(){
        canvas.fillStyle = "rgb(0, 0, 0)";
        canvas.fillRect(this.x + BLOCK_SIZE / 2, this.y, this.width - BLOCK_SIZE / 2, this.height);
        
        canvas.fillStyle = silver(7);
        canvas.beginPath();
        canvas.arc(this.x + BLOCK_SIZE / 2, this.y + BLOCK_SIZE / 2, BLOCK_SIZE / 2 , 0, 2 * Math.PI);
        canvas.fill();
        
        canvas.beginPath();
        canvas.arc(this.x + this.width - BLOCK_SIZE / 2, this.y + BLOCK_SIZE / 2, BLOCK_SIZE / 2 , 0, 2 * Math.PI);
        canvas.fill();
    },
    collide : function(entity){
        var speed = blocksPerSecond(1);
        entity.setY(this.y - entity.height);
        entity.falling = false;
        entity.moveX((this.movesRight) ? speed : -speed);
    },
    update : function(){
        //do nothing
    }
};
extend(Belt, Machine);


//next
function Tram(x, y, destinations, autoOn){
    Machine.call(this, x, y, autoOn);
    this.destinations = [];
    var t = this;
    destinations.forEach(function(coords){t.destinations.push([coords[0] * BLOCK_SIZE, coords[1] * BLOCK_SIZE])});
    this.destNum = 0;
    this.ready = true;
    this.moving = false;
    this.carrying = null;
}
extend(Tram, Machine);
Tram.prototype.draw = function(){
    canvas.fillStyle = silver(7);
    canvas.fillRect(this.x + BLOCK_SIZE / 4, this.y, BLOCK_SIZE / 2, BLOCK_SIZE);
    canvas.fillRect(this.x, this.y + BLOCK_SIZE * 0.75, BLOCK_SIZE, BLOCK_SIZE / 4);
    
    if (this.autoOn || this.powered){
        canvas.fillStyle = energy_color;
        canvas.fillRect(this.x, this.y + BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE / 20);
    }
}
Tram.prototype.collide = function(entity){
    if(this.carrying === null){
        this.carrying = entity;
        this.moving = true;
    }
}
Tram.prototype.checkForCollide = function(entity){
    Machine.prototype.checkForCollide.call(this, entity);
    
    if(!this.moving && this.isEnabled() && entity.x >= this.x && entity.x <= this.x + BLOCK_SIZE && entity.y >= this.y + BLOCK_SIZE){
        entity.moveY(-GRAVITY * 2);
    }
}
Tram.prototype.followPath = function(){
    if(this.destinations.length > 0){
        current = this.destinations[this.destNum];
        var speed = blocksPerSecond(1);
        if (this.x > current[0]){
            this.x -= speed;
        } else if (this.x < current[0]){
            this.x += speed;
        }
    
        if (this.y > current[1]){
            this.y -= speed;
        } else if (this.y < current[1]){
            this.y += speed;
        }
    
        //todo: add checking if closest possible coords
        if (this.x === current[0] && this.y === current[1]){
            this.dest_num++;
            if (this.dest_num + 1 === this.destinations.length){
                this.ready = false;
            }
            if (this.dest_num === this.destinations.length){
                this.dest_num = 0;
                this.ready = true;
                this.moving = false;
            }
        }
    }
}
Tram.prototype.update = function(){
    if(this.moving){
        this.followPath();
        this.powered = true; //otherwise, will stop immediately upon moving
    }
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

/*
Tram.prototype = {
    update:function(){
        if (this.moving){
            this.follow_path();
            this.powered = true;
        }
        if (!this.powered && !this.auto_on){return;}
        
        if (!this.ready){return;}
        
        if (player.x >= this.x && player.x <= this.x + BLOCK_SIZE && player.y > this.y + BLOCK_SIZE * 1.5){
            player.y -= GRAVITY * 2;
           // player.falling = false;
            if (player.y > this.y + BLOCK_SIZE * 1.5){return;}
            player.x = this.x + BLOCK_SIZE / 2;
            this.moving = true;
        }
    },
    */

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