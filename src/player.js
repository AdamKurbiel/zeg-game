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
    this.d = 0; //OPÓŹNIENIE ANIMACJI

    this.paused = false
}

Player.prototype.move = function(dx,dy,map){
    if (this.paused) return;
    let nextTile = map.content[this.y+dy][this.x+dx];
    if (nextTile == "#") return; //sprawdzam czy to sciana

    this.x += dx;
    this.y += dy;

    this.animationState = "WALK";

    if (nextTile == "H"){//leczenie (dodaje jeden punkt życia)
        map.clearRow(this.x,this.y);
        this.health += 1;
    }

    if (nextTile == "E"){
        this.paused = true;
    }
    
}