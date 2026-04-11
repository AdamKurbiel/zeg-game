export function Player(){
    this.health = 3;

    this.x = 1;
    this.y = 1;

    this.color = "brown";
}

Player.prototype.move = function(dx,dy,map){
    let nextTile = map[this.y+dy][this.x+dx];
    if (nextTile == "#") return; //sprawdzam czy to sciana

    this.x += dx;
    this.y += dy;
}