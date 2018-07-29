// this can be improved
function Level(name, blockConstructors, level_data, start) {
    this.name = name;
    this.blockConstructors = blockConstructors;
    this.level_data = level_data;
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