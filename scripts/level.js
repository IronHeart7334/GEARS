//not done
function Area(blockConstructors, blockMap, machines, leftSpawn, rightSpawn){
    /*
    Parameters:
        blockConstructors : an array of functions, each of which is the constructor of a class extending Block.
                            the function should accept 2 parameters: an x-block offset, and a y-block offset 
                            (see blocks.js for details)
        blockMap : an array of arrays of integers (see loadMap for details)
        machines : an array of objects inheriting from Machine
        leftSpawn : an array of two integers : the x and y block offset that the player will spawn from when entering this area from the left side
        rightSpawn : equivolent of leftSpawn, but when approaching from the right side
    */
    "use strict";
    try{
        // make sure blockConstructors is valid
        if(!Array.isArray(blockConstructors)){
            throw new TypeError("blockConstructors must be an array of functions extending Block");
        }
        if(!blockConstructors.every(function(element){return isFunction(element); })){
            throw new TypeError("invalid element in blockConstructors");
        }
        //TODO: add checking for extention
        
        // check blockMap
        if(blockMap[0][0] === undefined){
            throw new RangeError("block map must be an array of arrays of integers");
        }
        if(!blockMap.every(function(array){return array.every(Number.isInteger)})){
            throw new TypeError("all elements in block map must be integers");
        }
        if(max(blockMap) > blockConstructors.length){
            throw new RangeError("cannot have block in map with id over " + blockConstructors.length);
        }
        
        // check machines
        if(!Array.isArray(machines)){
            throw new TypeError("machines must be an array");
        }
        //TODO: add checking for extention
        
        // check spawns
        if(!Array.isArray(leftSpawn) || !Array.isArray(rightSpawn)){
            throw new TypeError("leftSpawn and rightSpawn must be arrays");
        }
        if(leftSpawn.length != 2 || rightSpawn.length != 2){
            throw new RangeError("left and right spawn should contain exactly 2 elements");
        }
        
    } catch(e){
        console.log(e.stack);
    }
    this.blockConstructors = blockConstructors;
    this.blockMap = blockMap;
    this.machines = machines;
    // + 0.5 is for a half-block offset
    this.leftSpawn = [(leftSpawn[0] + 0.5) * BLOCK_SIZE, (leftSpawn[1] + 0.5) * BLOCK_SIZE];
    this.rightSpawn = [(rightSpawn[0] + 0.5) * BLOCK_SIZE, (rightSpawn[1] + 0.5) * BLOCK_SIZE];
}
Area.prototype = {
    loadMap : function(){
        /* 
        loads all the blocks into this area's 'memory'.
        Only need to run once, saving lots of time
        */
        
        var map = this.blockMap;
        var longestRow = 0;
        
        this.blocks = [];
        
        for(var row = 0; row < map.length; row++){
            if(map[row].length > longestRow){
                longestRow = map[row].length;
            }
            for(var column = 0; column < map[row].length; column++){
                if(map[row][column] !== 0){
                    // a 0 corresponds to 'no block', a 1 is the block type at index 0 of blockConstructors etc.
                    this.blocks.push(new this.blockConstructors[map[row][column] - 1](column, row));
                }
            }
        }
        
        this.height = map.length * BLOCK_SIZE;
        this.width = longestRow * BLOCK_SIZE;
        
        this.machines.forEach(function(machine){machine.init()});
    },
    
    //energy functions have to do with machines
    // will redo once machines are improved
    updateMachines : function(){
        this.energy = []; // needs to be added by machine
        
        //improve this
        function within(machine){
            return function(coords){
                return coords[0] === machine.x - BLOCK_SIZE && coords[1] === machine.y;
            }
        }
        for(machine of this.machines){
            /*
            if(this.energy.some(within(machine))){
                machine.powered = true;
            } else {
                machine.powered = false;
            }*/
            machine.checkIfUpdate();
        }
    },
    //not implemented yet
    addEnergy : function(x, y){
        this.energy.push([x, y]);
    },
    
    checkColl : function(entity){
        for(var block of this.blocks){
            block.checkColl(entity);
        }
        for(var machine of this.machines){
            machine.checkForCollide(entity);
        }
    },
    
    draw : function(){
        this.blocks.forEach(function(block){block.draw();});
        this.machines.forEach(function(machine){machine.draw();});
    },
    
    update : function(){
        this.updateMachines();
        this.checkColl(player); //improve later
    },
    
    loadPlayerLeft : function(entity){
        entity.load(this.leftSpawn[0], this.leftSpawn[1]);
    },
    
    loadPlayerRight : function(entity){
        entity.load(this.rightSpawn[0], this.rightSpawn[1]);
    }
}

/*
importDataFromFile : function(path){
        // this is not working
        var req = new XMLHttpRequest();
        req.open("GET", path, true);
        req.onreadystatechanged = function(){
            if(req.readyState === 4){
                if(req.status === 200 || req.status === 0){
                    console.log(req.responseText);
                }
            }
        }
        req.send(null);
    }
*/

function Level(name, areas, startAreaNumber, spawnsOnLeft){
    this.name = name;
    this.areas = areas;
    this.start = startAreaNumber;
    this.spawnLeft = spawnsOnLeft;
}
Level.prototype = {
    load : function(){
        //loads the area data into memory, does not start the level
        this.areas.forEach(function(area){area.loadMap();});
    },
    play : function(player){
        var area = this.areas[this.start];
        if(this.spawnLeft){
            player.init(area.leftSpawn[0], area.leftSpawn[1]);
        } else {
            player.init(area.rightSpawn[0], area.rightSpawn[1]);
        }
        this.currentArea = this.start;
    },
    draw : function(){
        this.areas[this.currentArea].draw();
    },
    update : function(){
        if(player.x < 0 && this.currentArea != 0){
            //exit left
            this.currentArea--;
            this.areas[this.currentArea].loadPlayerRight(player);
        } else if(player.x > this.areas[this.currentArea].width && this.currentArea < this.areas.length){
            //exit right
            this.currentArea++;
            this.areas[this.currentArea].loadPlayerLeft(player);
        }
        this.areas[this.currentArea].update();
    }
}