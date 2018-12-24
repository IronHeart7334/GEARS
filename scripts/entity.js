/*
 * The Entity class is used as the base for most of the other classes used by this program.
 * Entity is basically a way to store an object's position and size, so checking for collisions is a snap.
 *
 * HOW TO EXTEND ENTITY
 * Inheritance in Javascript is... painful.
 * Luckily, I've written a function in the 'utilities.js' module that does it for you!
 *
 * EXAMPLE:
 *   function a(b, c){...};
 *   a.prototype = {...};
 *
 *   function d(e, f){
 *       a.call(this, e, f);
 *   }
 *   d.prototype = {...};
 *   extend(d, a); //think of it as 'class d extends a'
 *
 * See the documentation in the aformentioned utilities module for more details
 */

/*
 * TODO:
 * -remove references to BLOCK_SIZE
 */

class Entity{
    constructor(){
      this.x = 0;
      this.y = 0;
      this.width = BLOCK_SIZE;
      this.height = BLOCK_SIZE;
      this.hostingGame = null; //the game where this entity is used
    }
    setX(x){
        this.x = x;
    }
    setY(y){
        this.y = y;
    }
    setCoords(x, y){
        this.setX(x);
        this.setY(y);
    }
    moveX(x){
        this.x += x;
    }
    moveY(y){
        this.y += y;
    }
    move(x, y){
        this.moveX(x);
        this.moveY(y);
    }
    setWidth(w){
        this.width = w;
    }
    setHeight(h){
        this.height = h;
    }
    checkForCollide(entity){
        return (
            this.x + this.width >= entity.x &&
            this.x <= entity.x + entity.width &&
            this.y + this.height >= entity.y &&
            this.y <= entity.y + entity.height
        );
    }
    setHostingGame(game){
        this.hostingGame = game;
    }
    getHost(){
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
