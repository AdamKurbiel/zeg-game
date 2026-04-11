

function randomNumber(min,max){
    return Math.floor(Math.random() * max) + min;
}

export function Player(){
    this.health = 3,

    this.x = 1,
    this.y = 1,
    this.renderX = this.x,
    this.renderY = this.y,

    this.color = "brown",
    this.animationState = "IDLE",
    this.foot = 0, //ANIMACJA CHODZENIA

    this.paused = false
}
Player.prototype.resetPosition = function(map){
    var block = map.findFirstBlock("S");//szukam startu
    if (block == false) return;

    this.x = block[1];
    this.y = block[0];
    this.renderX = this.x;
    this.renderY = this.y;
}

Player.prototype.update = function(keys, map, now, moveCooldown, moveDelay) {

    if (this.paused) return moveCooldown;
    if (now - moveCooldown <= moveDelay) return moveCooldown;

    const IDLE_TIME = 120;
    let dx = 0;
    let dy = 0;

    if (keys.w) dy = -1;
    else if (keys.s) dy = 1;
    else if (keys.a) dx = -1;
    else if (keys.d) dx = 1;

    if (dx !== 0 || dy !== 0) {
        this.move(dx, dy, map);
        return now;
    }

    if (Date.now() - Player.lastMoveTime > IDLE_TIME){
        Player.animationState = "IDLE";
    }
    return moveCooldown;
};

Player.prototype.move = function(dx,dy,map){
    if (this.paused) return;
    
    let nextTile = map.content()[this.y+dy][this.x+dx];
    if (nextTile == "#") return; //sprawdzam czy to sciana

    this.x += dx;
    this.y += dy;

    this.foot = this.foot ? 0 : 1 ;
    this.animationState = `WALK${this.foot}`;//walk0 albo walk1

    if (nextTile == "H"){//leczenie (dodaje jeden punkt życia)
        map.clearRow(this.x,this.y);
        this.health += 1;
    }

    if (nextTile == "E"){
        this.paused = true;
    }
    
}