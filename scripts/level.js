/*
 * TODO:
 * -Move emitting range from Area.updateMachines to Machine
 * -Make an entity list for each area/level, then iterate through it in Area.update, passing each into this.checkColl
 * -get rid of player global
 */

/*
 * The Area class is used to break up levels into several sections, which are passed in to the Level constructor
 *
 * setHostingGame is invoked by Level
 */
class Area{
    constructor(blockConstructors, blockMap, machines, leftSpawn, rightSpawn){
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
        this.leftSpawn = [leftSpawn[0] * BLOCK_SIZE, leftSpawn[1] * BLOCK_SIZE];
        this.rightSpawn = [rightSpawn[0] * BLOCK_SIZE, rightSpawn[1] * BLOCK_SIZE];
        this.hostingGame = null;
    }
    loadMap(){
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
                    var newBlock = new this.blockConstructors[map[row][column] - 1](column, row);
                    if(row !== 0 && map[row - 1][column] !== 0){
                        newBlock.disableTop();
                    }
                    this.blocks.push(newBlock);
                }
            }
        }

        this.height = map.length * BLOCK_SIZE;
        this.width = longestRow * BLOCK_SIZE;

        this.machines.forEach(function(machine){machine.init()});
    }

    //checks which machines are within emitting distance of others
    //TODO: move emitting range to Machine
    updateMachines(){
        for(var machine of this.machines){
            function check(otherMachine){
                var ret = false;
                if(otherMachine.getEmitting()){
                    ret = distance(machine.x, machine.y, otherMachine.x, otherMachine.y) <= BLOCK_SIZE * 5;
                }
                return ret;
            }

            machine.powered = this.machines.some(check);
            machine.checkIfUpdate();
        }
    }
    checkColl(entity){
        for(var block of this.blocks){
            block.checkColl(entity);
        }
        for(var machine of this.machines){
            machine.checkColl(entity);
        }
    }

    draw(canvas){
        this.blocks.forEach(function(block){block.draw(canvas);});
        this.machines.forEach(function(machine){machine.draw(canvas);});
    }

    update(){
        this.updateMachines();
        this.checkColl(player); //improve later
    }

    loadPlayerLeft(entity){
        entity.load(this.leftSpawn[0], this.leftSpawn[1]);
    }

    loadPlayerRight(entity){
        entity.load(this.rightSpawn[0], this.rightSpawn[1]);
    }
    setHostingGame(game){
        this.hostingGame = game;
        function copyHost(entity){
            entity.setHostingGame(game);
        }
        this.blocks.forEach(copyHost);
        this.machines.forEach(copyHost);
    }
};

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

/*
 * The Level class is used to generate a level for the player to play through
 *
 * name : the name of the level (unused)
 * areas : an array of Areas, the different sections of the level
 * startAreaNumber : the Area the player will initialy spawn in. EX: 1 means player will start in the second Area is the areas array
 * spawnsOnLeft : boolean, whether or not the player will spawn initially on the left spawn point of the spawn area
 */
class Level{
    constructor(name, areas, startAreaNumber, spawnsOnLeft){
        this.name = name;
        this.areas = areas;
        this.start = startAreaNumber;
        this.spawnLeft = spawnsOnLeft;
        this.hostingGame = null;
    }
    load(){
        //loads the area data into memory, does not start the level
        let lv = this;
        lv.areas.forEach(function(area){
            area.loadMap();
            area.setHostingGame(lv.hostingGame);
        });
    }
    play(player){
        var area = this.areas[this.start];
        if(this.spawnLeft){
            player.init(area.leftSpawn[0], area.leftSpawn[1]);
        } else {
            player.init(area.rightSpawn[0], area.rightSpawn[1]);
        }
        this.currentArea = this.start;
        var ca = this.getCurrentArea();
        this.hostingGame.hostingCanvas.setContentSize(ca.width, ca.height);
    }
    getCurrentArea(){
        return this.areas[this.currentArea];
    }
    draw(canvas){
        this.areas[this.currentArea].draw(canvas);
    }
    update(){
        if(player.x < 0 && this.currentArea !== 0){
            //exit left
            this.currentArea--;
            this.areas[this.currentArea].loadPlayerRight(player);
            var ca = this.getCurrentArea();
            this.hostingGame.hostingCanvas.setContentSize(ca.width, ca.height);
        } else if(player.x > this.areas[this.currentArea].width && this.currentArea < this.areas.length - 1){
            //exit right
            this.currentArea++;
            this.areas[this.currentArea].loadPlayerLeft(player);
            var ca = this.getCurrentArea();
            this.hostingGame.hostingCanvas.setContentSize(ca.width, ca.height);
        }
        this.areas[this.currentArea].update();
    }
    setHostingGame(game){
        //invoked by GAME
        this.hostingGame = game;
        this.areas.forEach(function(area){area.setHostingGame(game);});
    }
};
