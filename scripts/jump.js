/*
 * The Jump class is used to give Player's a way to jump.
 * x_mom and y_mom are how many blocks the user will move after the jump is completed.
 * All functionality is stored in player.js
 */

//TODO: maybe move functionality from Player to Jump?

class Jump{
    constructor(name, x_mom, y_mom, color){
        this.name = name;
        this.xMom = x_mom;
        this.yMom = y_mom;
        this.color = color;
    }
}
Jump.regular = new Jump("Jump", 1, 1, "rgb(175, 175, 255)");
Jump.far = new Jump("Leap", 5, 0, "rgb(35, 100, 0)");
Jump.high = new Jump("Rocket", 1, 5, "rgb(150, 50, 0)");
