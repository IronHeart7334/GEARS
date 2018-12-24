/*
 * Machine is the abstract base class for the machines used by the program.
 * A machine is an object loaded with a level, which acts as a puzzle or obstacle for the player to overcome.
 *
 * Machines collide method is automatically invoked upon colliding with another entity,
 * with the entity passed as the parameter.
 *
 * update is invoked if the machine is either automatically on, or if it is near an emitting machine
 *
 * HOW TO EXTEND MACHINE:
 * function f(...){
 *      Machine.call(this, ...);
 * }
 * f.prototype = {
 *      draw : function(canvas){...},
 *      collide : function(entity){...},
 *      update : function(){...}
 * };
 * extend(f, Machine);
 *
 */

/*
 * TODO:
 * -move emitting range from Area.updateMachines to Machine
 * -get rid of global BLOCK_SIZE references.
 * -move PickupGear to Gear
 * -add downward lift platforms
 */

class Machine extends Entity{
    constructor(x, y, autoOn){
      super();
      this.startX = x * BLOCK_SIZE;
      this.startY = y * BLOCK_SIZE;
      this.autoOn = autoOn; //a machine that is autoOn will not need a power source to run
      this.emitting = false; //a machine that is emitting will power other machines within 5 blocks of its upper-left corner (look in level.js)
    }
    init(){
        this.setCoords(this.startX, this.startY);
        this.powered = false;
    }
    isEnabled(){
        return this.powered || this.autoOn;
    }
    setEmitting(boolean){
        this.emitting = boolean;
    }
    getEmitting(){
        return this.emitting;
    }
    draw(canvas){
        var obj = this;
        throw new Error("No draw method found for " + obj);
    }
    collide(entity){
        //each subclass defines
    }
    checkColl(entity){
        if(this.checkForCollide(entity)){
            this.collide(entity);
        }
    }
    update(){
        //defined by subclasses
    }
    checkIfUpdate(){
        if(this.isEnabled()){
            this.update();
        }
    }
};

// Gears provide players with a way to unlock new jumping patterns
class Gear extends Machine{
    constructor(x, y, jump){
        super(x, y, true);
        this.jump = jump;
        this.claimed = false;
        this.rotated = false;
        this.rotateCount = 0;
    }
    draw(canvas){
        if(!this.claimed){
            canvas.drawGear(this.x, this.y, BLOCK_SIZE * 0.9, this.jump.color, this.rotated);
        }
    }
    collide(entity){
        try{
            if(!this.claimed){
                entity.obtainGear(this.jump);
                this.claimed = true;
            }
        } catch(e){
            //not a Player
            console.log(e.stack);
        }
    }
    update(){
        if(!this.claimed){
            if(this.rotateCount === this.getHost().fps){
                this.rotated = !this.rotated;
                this.rotateCount = 0;
            }
            this.rotateCount++;
        }
    }
};

//A conveyor belt
class Belt extends Machine{
    constructor(x, y, width, movesRight, autoOn){
      super(x, y, autoOn);
      this.setWidth(width * BLOCK_SIZE);
      this.movesRight = movesRight;
    }
    draw(canvas){
        canvas.setColor("rgb(0, 0, 0)");
        canvas.rect(this.x + BLOCK_SIZE / 2, this.y, this.width - BLOCK_SIZE, this.height);

        canvas.setColor(silver(7));
        canvas.circle(this.x, this.y, BLOCK_SIZE);
        canvas.circle(this.x + this.width - BLOCK_SIZE, this.y, BLOCK_SIZE);
    }
    collide(entity){
        var speed = blocksPerSecond(1);
        entity.setY(this.y - entity.height);
        entity.falling = false;
        if(this.isEnabled()){
            entity.moveX((this.movesRight) ? speed : -speed);
        }
    }
    update(){
        //do nothing
    }
};


//A magnetic tram to carry the player
/*
 * destinations is an array of arrays of 2 ints:
 * the block offsets of the x and y coordinates that the tram will pass through
 */
class Tram extends Machine{
    constructor(x, y, destinations, autoOn){
        super(x, y, autoOn);
        this.destinations = [[this.startX, this.startY]];
        var t = this;
        destinations.forEach(function(coords){t.destinations.push([coords[0] * BLOCK_SIZE, coords[1] * BLOCK_SIZE])});
        this.destNum = 0; //the index of the next destination to go to
        this.ready = true; //has completed carrying an entity and has returned to its start point
        this.moving = false;
        this.carrying = null; //the entity this is carrying
    }
    draw(canvas){
        canvas.setColor(silver(7));
        canvas.rect(this.x + BLOCK_SIZE / 4, this.y, BLOCK_SIZE / 2, BLOCK_SIZE);
        canvas.rect(this.x, this.y + BLOCK_SIZE * 0.75, BLOCK_SIZE, BLOCK_SIZE / 4);

        if (this.isEnabled()){
            canvas.setColor("rgb(155, 255, 0)");
            canvas.rect(this.x, this.y + BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE / 20);
        }
    }
    collide(entity){
        if(this.ready && this.isEnabled() && this.carrying === null){
            this.carrying = entity;
            this.moving = true;
            this.ready = false;
        }
    }
    checkForCollide(entity){
        var ret = false;
        if(!this.moving){
            ret = Machine.prototype.checkForCollide.call(this, entity);
        }

        if(!this.moving && this.isEnabled() && entity.x >= this.x && entity.x <= this.x + BLOCK_SIZE && entity.y >= this.y + BLOCK_SIZE){
            entity.moveY(-blocksPerSecond(2));
            entity.falling = false;
        }
        return ret;
    }
    followPath(){
        let current = this.destinations[this.destNum];
        var speed = blocksPerSecond(3);
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

        //check if we are as close as possible
        if (between(current[0], this.x, current[0] + speed) && between(current[1], this.y, current[1] + speed)){
            if(this.destNum === 0 && !this.ready && !this.carrying){
                this.ready = true;
                this.moving = false;
            } else {
                this.destNum++;
            }
            if (this.destNum === this.destinations.length){
                //completed path
                this.destNum = 0;
                this.carrying = null;
            }
        }
    }
    update(){
        if(this.moving){
            this.followPath();
            if(this.carrying !== null){
                this.carrying.setCoords(this.x, this.y + this.height);
                this.carrying.falling = false;
            }
            this.powered = true; //otherwise, will stop immediately upon moving
        }
    }
};

// a power generator that powers nearby machines
class Generator extends Machine{
    constructor(x, y){
        super(x, y, true);
        this.setHeight(BLOCK_SIZE * 2);
        this.setEmitting(true);
    }
    draw(canvas) {
        canvas.setColor(silver(7));
        canvas.rect(this.x + BLOCK_SIZE * 0.1, this.y - BLOCK_SIZE, BLOCK_SIZE * 0.8, BLOCK_SIZE * 2);

        canvas.setColor(silver(4));
        canvas.rect(this.x, this.y - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE / 2);
        canvas.rect(this.x, this.y + BLOCK_SIZE / 2, BLOCK_SIZE, BLOCK_SIZE / 2);

        canvas.setColor("rgb(155, 255, 0)");
        canvas.rect(this.x + BLOCK_SIZE * 0.4, this.y - BLOCK_SIZE / 2, BLOCK_SIZE / 5, BLOCK_SIZE);
    }
    update() {
        //do nothing
    }
};



//acts as a block while it isn't powered
class Door extends Machine{
    constructor(x, y){
        super(x, y, false);
    }
    collide(entity) {
        if(!this.isEnabled()){
            if(entity.x + entity.width / 2 > this.x + this.width / 2){
                //over halfway through
                entity.setX(this.x + this.width);
            } else {
                entity.setX(this.x - entity.width);
            }
        }
    }
    draw(canvas) {
        if (!this.isEnabled()){
            canvas.setColor(silver(6));
            canvas.rect(this.x + BLOCK_SIZE / 10, this.y, BLOCK_SIZE * 0.8, BLOCK_SIZE);

            canvas.setColor("rgb(0, 0), 0)");
            canvas.rect(this.x + BLOCK_SIZE / 10, this.y + BLOCK_SIZE / 2, BLOCK_SIZE * 0.8, 1);
        }

        canvas.setColor(silver(2));
        canvas.rect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE / 10);
        canvas.rect(this.x, this.y + BLOCK_SIZE * 0.9, BLOCK_SIZE, BLOCK_SIZE / 10);
    }
    update() {
        // do nothing
    }
};


// gives the user gears, which can be put into a Train. Kinda redundant, will move into Gear soon.
class PickupGear extends Machine{
    constructor(x, y){
        super(x, y, true);
        this.claimed = false;
        this.rotated = false;
        this.rotateCount = 0;
    }
    draw(canvas){
        if(!this.claimed){
            canvas.drawGear(this.x, this.y, BLOCK_SIZE * 0.9, gold(7), this.rotated);
        }
    }
    collide(entity){
        try{
            if(!this.claimed){
                entity.pickup("gear");
                this.claimed = true;
            }
        } catch(e){
            //not a Player
            console.log(e.stack);
        }
    }
    update(){
        if(!this.claimed){
            if(this.rotateCount === this.getHost().fps){
                this.rotated = !this.rotated;
                this.rotateCount = 0;
            }
            this.rotateCount++;
        }
    }
};



// a gear train. When a player collides with it, if they have a pickup gear, slots it in. Emits once it is full of gears
class Train extends Machine{
    constructor(x, y, autoOn, gearsNeeded){
        super(x, y, autoOn);
        this.setWidth(BLOCK_SIZE * gearsNeeded);
        this.maxGears = gearsNeeded;
        this.gearCount = 0;
        this.rotateCount = 0;
        this.firstRotated = true;
    }
    draw(canvas){
        canvas.setColor(silver(4));
        canvas.rect(this.x, this.y, this.width, BLOCK_SIZE);

        for(var i = 0; i < this.gearCount; i++){
            canvas.drawGear(this.x + BLOCK_SIZE * i, this.y, BLOCK_SIZE, silver(2), (i % 2 === 0) ? this.firstRotated : !this.firstRotated);
        }
    }
    collide(entity){
        try{
            if(entity.getHasPickup("gear") && this.gearCount < this.maxGears){
                this.gearCount++;
                entity.loseItem("gear");
            }
        } catch(e){
            //not a player
            console.log(e.stack);
        }
    }
    update(){
        if(this.gearCount === this.maxGears){
            this.setEmitting(true);
            this.rotateCount++;
            if(this.rotateCount === this.getHost().fps){
                this.rotateCount = 0;
                this.firstRotated = !this.firstRotated;
            }
        }
    }
};


//lift platform. Carries entities up.
class Lift extends Machine{
    constructor(x, y, autoOn, distUp){
        //distUp is the amount of blocks it will move up
        super(x, y, autoOn);
        this.setHeight(BLOCK_SIZE / 10);
        this.maxAscent = this.startY - distUp * BLOCK_SIZE;
        this.goingUp = true;
        this.moving = false;
        this.waiting = false; //waiting to go back down
        this.waitTime = 0;
    }
    draw(canvas){
        canvas.setColor(silver(3));
        canvas.rect(this.x, this.y - BLOCK_SIZE / 10, this.width, this.height);
    }
    collide(entity){
        entity.setY(this.y - entity.height);
        this.moving = true;
    }
    update(){
        if(this.moving){
            var speed = blocksPerSecond(2);
            if(this.goingUp){
                speed = -speed;
            }

            if(!this.waiting){
                this.moveY(speed);
            }

            if(this.waiting){
                if(this.waitTime === this.getHost().fps * 2){
                    this.waitTime = 0;
                    this.waiting = false;
                } else {
                    this.waitTime++;
                }
            }

            //remember, higher y means further down
            if(this.y <= this.maxAscent && this.goingUp){
                this.goingUp = false;
                this.waiting = true;
            } else if(this.y >= this.startY && !this.goingUp){
                this.goingUp = true;
                this.moving = false;
                this.waiting = true;
            }
        }
    }
};
