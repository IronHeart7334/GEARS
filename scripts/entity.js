//the base class that will be used by most of the program
function Entity(){
    this.x = 0;
    this.y = 0;
    this.width = BLOCK_SIZE;
    this.height = BLOCK_SIZE;
    this.hostingGame = null; //the game where this entity is used
}

Entity.prototype = {
    setX : function(x){
        this.x = x;
    },
    setY : function(y){
        this.y = y;
    },
    setCoords : function(x, y){
        this.setX(x);
        this.setY(y);
    },
    moveX : function(x){
        this.x += x;
    },
    moveY : function(y){
        this.y += y;
    },
    move : function(x, y){
        this.moveX(x);
        this.moveY(y);
    },
    setWidth : function(w){
        this.width = w;
    },
    setHeight : function(h){
        this.height = h;
    },
    checkForCollide : function(entity){
        return (
            this.x + this.width >= entity.x &&
            this.x <= entity.x + entity.width &&
            this.y + this.height >= entity.y &&
            this.y <= entity.y + entity.height
        );
    },
    isWithin : function(x1, y1, x2, y2){
        /*
        x1, y1: upper left corner
        x2, y2: lower right
        */
        return (
            (this.x + this.width >= x1) &&
            (this.y + this.height >= y1) &&
            (this.x <= x2) &&
            (this.y <= y2)
        );
    },
    setHostingGame : function(game){
        this.hostingGame = game;
    },
    getHost : function(){
        return this.hostingGame;
    }
};

//works
function testCollide(){
    var e1 = new Entity();
    var e2 = new Entity();
    e1.setCoords(0, 0);
    e2.setCoords(100, 0);
    for(var i = 0; i < 200; i++){
        if(e1.checkForCollide(e2)){
            console.log("Collision @ x" + i);
        }
        e1.x++;
    }
    e1.setCoords(0, 0);
    e2.setCoords(0, 100);
    for(var i = 0; i < 200; i++){
        if(e1.checkForCollide(e2)){
            console.log("Collision @ y" + i);
        }
        e1.y++;
    }
}