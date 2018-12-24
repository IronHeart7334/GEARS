/*
 * The Game class is used to store the info of the current play session
 *
 * use this class to avoid global variables.
 *
 * The Game class handles all the updating, including drawing.
 */

/*
 * TODO:
 * -make Game class store blockSize
 */

class Game{
    constructor(){
        this.currentLevel = null;
        this.player = null;
        this.fps = 20;
        this.timer = null;
        this.paused = true;
        this.hostingCanvas = null; //the Canvas this is drawing on (my class, not DOM element)
    }
    setHost(canvas){
        this.hostingCanvas = canvas;
    }
    setPlayer(player){
        this.player = player;
        player.setHostingGame(this);
    }
    setLevel(level){
        this.currentLevel = level;
        level.setHostingGame(this);
    }
    pause(){
        try{
            clearInterval(this.timer);
            this.paused = true;
        } catch(e){
            console.log(e.stack);
        }
    }
    resume(){
        var g = this;
        this.timer = setInterval(g.update.bind(g), 1000 / g.fps);
        this.paused = false;
    }
    togglePause(){
        if(this.paused){
            this.resume();
        } else {
            this.pause();
        }
    }
    update(){
        var c = this.hostingCanvas;
        c.fillStyle = "black";
        c.clear();

        this.player.update();
        this.currentLevel.update();

        this.hostingCanvas.setFocus(this.player.x, this.player.y);
        this.hostingCanvas.updateTranslate();
        this.currentLevel.draw(this.hostingCanvas);
        this.player.draw(this.hostingCanvas);
        this.hostingCanvas.resetTranslate();
        this.player.drawHUD(this.hostingCanvas);
    }
};
