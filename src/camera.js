import { TILE_SIZE } from "./renderer.js";

export function Camera(){
    this.x = 0,
    this.y = 0,
    this.renderX = this.x,
    this.renderY = this.y
}

function lerp (start, end, t){
    return start * (1 - t) + end * t;
}

Camera.prototype.updateRaw = function(plr, width, height){ //ustawia na sucho pozycję bez lerp
    this.x = plr.x * TILE_SIZE - width/2;
    this.y = plr.y * TILE_SIZE - height/2;

    this.renderX = this.x;
    this.renderY = this.y;
}

Camera.prototype.updatePosition = function(plr, width, height){
    this.renderX = lerp(this.renderX,this.x,0.025);
    this.renderY = lerp(this.renderY,this.y,0.025);

    this.x = plr.x * TILE_SIZE - width/2;
    this.y = plr.y * TILE_SIZE - height/2;


}