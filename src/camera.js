export function Camera(){
    this.x = 0,
    this.y = 0,
    this.renderX = this.x,
    this.renderY = this.y
}

function lerp (start, end, t){
    return start * (1 - t) + end * t;
}

Camera.prototype.updatePosition = function(plr, tile_size, width, height){
    this.renderX = lerp(this.renderX,this.x,0.025);
    this.renderY = lerp(this.renderY,this.y,0.025);

    this.x = plr.x * tile_size - width/2;
    this.y = plr.y * tile_size - height/2;
}