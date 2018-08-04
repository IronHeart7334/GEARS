function CollideEvent(hitter, wasHit){
    this.hitter = hitter;
    this.wasHit = wasHit;
    
    /*
     * Boolean values showing where target was hit from
     * 
     * top: was within the target's width and less than halfway through its height
     */
    this.top = hitter.isWithin(
                wasHit.x,
                wasHit.y,
                wasHit.x + wasHit.width,
                wasHit.y + wasHit.height / 2
            );
    this.bottom = hitter.isWithin(
                wasHit.x,
                wasHit.y + wasHit.height / 2,
                wasHit.x + wasHit.width,
                wasHit.y + wasHit.height
            );
    this.left = hitter.isWithin(
                wasHit.x,
                wasHit.y,
                wasHit.x + wasHit.width / 2,
                wasHit.y + wasHit.height
            );
    this.right = hitter.isWithin(
                wasHit.x + wasHit.width / 2,
                wasHit.y,
                wasHit.x + wasHit.width,
                wasHit.y + wasHit.height
            );
}