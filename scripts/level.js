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
    this.leftSpawn = leftSpawn * BLOCK_SIZE;
    this.rightSpawn = rightSpawn * BLOCK_SIZE;
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
            if(this.energy.some(within(machine))){
                machine.powered = true;
            } else {
                machine.powered = false;
            }
            machine.update();
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
    },
    
    draw : function(){
        this.blocks.forEach(function(block){block.draw();});
        this.machines.forEach(function(machine){machine.draw();});
    },
    
    update : function(){
        this.updateMachines();
        this.checkColl(player); //improve later
    },
    
    contains : function(entity){
        // returns whether or not an entity is within the bounds of this area
        return entity.within(0, 0, this.width, -this.height);
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
// this can be improved
function Level(name, blockConstructors, levelData, start) {
    /*
    Parameters:
        name : a String, currently unused, but will be used in level select later
        blockConstructors : an array of functions, each of which is the constructor of a class extending Block.
                            the function should accept 2 parameters: an x-block offset, and a y-block offset 
                            (see blocks.js for details)
        levelData : *sigh* need to redo. A group of nested arrays:
                    [
                        [
                            [
                                [0, 0, 0...],
                                [0, 0, 0...],
                                [0, 0, 0...]...
                            ],
                            [
                                new Gear(...),
                                ...
                            ]
                        ],
                        [
                            [
                                [0, 0, 0...],
                                [0, 0, 0...],
                                [0, 0, 0...]...
                            ],
                            [
                                new Gear(...),
                                ...
                            ]
                        ],
                        [
                            [
                                [0, 0, 0...],
                                [0, 0, 0...],
                                [0, 0, 0...]...
                            ],
                            [
                                new Gear(...),
                                ...
                            ]
                        ]...
                    ]
                    where a[0] is the leftmost area in the level, 
                    a[0][0] is the block map for that area,
                    and a[0][1] is the machines for that area
        
        start is an array of 3 items: the starting map number, and the x and y coordinates.
                                        this denotes where the player will spawn.
    */
    this.name = name;
    this.blockConstructors = blockConstructors;
    this.level_data = levelData;
    this.current_map_number = start[0];
    this.start_coords = [start[1], start[2]];
}
Level.prototype = {
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
    },
    
    load_map:function(){
        this.blocks = [];
        this.current_map = this.level_data[this.current_map_number][0];
        this.longest_row = 0;
        this.height = this.current_map.length;
        this.height_in_px =  this.height * BLOCK_SIZE;
        for (var row = 0; row < this.current_map.length; row++) {
            for (var column = 0; column < this.current_map[row].length; column++){
                
                if (this.current_map[row].length > this.longest_row){
                    this.longest_row = this.current_map[row].length;
                } 
                
                if (this.current_map[row][column] != 0){
                    this.blocks.push(new this.blockConstructors[this.current_map[row][column] - 1](column, row));
                }	
            }
        }
    },
    
    load_machines:function() {
        this.machines = [];
        this.current_machines = this.level_data[this.current_map_number][1];
        for (machine of this.current_machines) {
            this.machines.push(machine);
        }
    },
    
    load:function() {
        this.load_map();
        this.load_machines();
    },
    
    add_energy:function(x, y) {
        for (coord_set of this.energy){
            if (coord_set[0] == x && coord_set[1] == y){return;}
        }
        this.energy.push([x, y]);
    },
    
    check_energy:function(machine) {
        machine.powered = false;
        for (coord_set of this.energy){
            if (coord_set[0] == machine.x - BLOCK_SIZE && coord_set[1] == machine.y){
                machine.powered = true;
                break;
            }
        }
    },
    
    check_coll:function(object) {
        for (block of this.blocks){
            block.checkColl(object);
        }
    },
    
    update_machines:function() {
        this.energy = [];
        for (machine of this.machines) {
            this.check_energy(machine);
            machine.update();
        }
    },
    
    draw_map:function() {
        for (var block of this.blocks){
            block.draw();
        }
    },
    
    draw_machines:function() {
        for (machine of this.machines){
            machine.draw();
        }
    },
    
    draw:function() {
        this.draw_machines();
        this.draw_map();
    },
    
    check_for_area:function(){
    
        if (player.x < BLOCK_SIZE / 2) {
        
            if (this.current_map_number > 0){
                this.current_map_number -= 1;
                this.load();
                player.x = this.longest_row * BLOCK_SIZE - BLOCK_SIZE / 2;
                player.spawn_coords = [player.x, player.y];
            } 
        }
        
        if (player.x > this.longest_row * BLOCK_SIZE) {
            if (this.current_map_number < this.level_data.length - 1){
                this.current_map_number += 1;
                this.load();
                player.x = BLOCK_SIZE / 2;
                player.spawn_coords = [player.x, player.y];
            } 
        }
    },
    
    update:function() {
        this.check_for_area();
        this.update_machines();
        this.check_coll(player);
    },
    
    run:function() {
        player.load(this.start_coords[0], this.start_coords[1]);
    }
}

//need to implement
function Level2(name, areas, startAreaNumber, spawnsOnLeft){
    this.name = name;
    this.areas = areas;
    this.start = startAreaNumber;
    this.spawnLeft = spawnsOnLeft;
}
Level2.prototype = {
    load : function(){
        //loads the area data into memory, does not start the level
        this.areas.forEach(function(area){area.loadMap();});
    },
    play : function(player){
        if(this.spawnLeft){
            this.areas[this.start].loadPlayerLeft(player);
        } else {
            this.areas[this.start].loadPlayerRight(player);
        }
        this.currentArea = this.start;
    },
    update : function(){
        if(!this.areas[this.currentArea].contains(player)){
            //no longer in area
            if(player.x < 0){
                //exit left
                if(this.currentArea > 0){
                    this.currentArea--;
                    this.areas[this.currentArea].loadPlayerRight(player);
                }
            } else if(this.currentArea < this.areas.length){
                //if not contains, and doesn't exit left, check if can exit right
                this.currentArea++;
                this.areas[this.currentArea].loadPlayerLeft(player);
            }
        }
        this.areas[this.currentArea].update();
    }
}