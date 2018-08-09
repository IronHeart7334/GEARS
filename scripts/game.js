/*
 * The Game class is used to store the info of the current play session
 */

function Game(){
    this.playing = false;
    this.currentLevel = null;
    this.player = null;
    this.fps = 20;
    this.timer = null;
    this.paused = true;
    this.hostingCanvas = null;
}
Game.prototype = {
    setHost : function(canvas){
        this.hostingCanvas = canvas;
    },
    setPlayer : function(player){
        this.player = player;
        player.setHostingGame(this);
    },
    setLevel : function(level){
        this.currentLevel = level;
        level.setHostingGame(this);
    },
    pause : function(){
        try{
            clearInterval(this.timer);
            this.paused = true;
        } catch(e){
            console.log(e.stack);
        }
    },
    resume : function(){
        var g = this;
        this.timer = setInterval(g.update.bind(g), 1000 / g.fps);
        this.paused = false;
    },
    togglePause : function(){
        if(this.paused){
            this.resume();
        } else {
            this.pause();
        }
    },
    update : function(){
        var c = this.hostingCanvas;
        c.fillStyle = "black";
        c.fillRect(0, 0, c.width, c.height);
        
        update_camera();
        this.player.update();
        this.currentLevel.update();
        this.currentLevel.draw();
        this.player.draw();
        reset_camera();
        this.player.drawHUD();
    }
};
