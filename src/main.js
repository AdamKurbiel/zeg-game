import { Map } from "./maps.js";
import { buildMap, renderPlayer, TILE_SIZE} from "./renderer.js";
import { Player } from "./player.js";
import { Camera } from "./camera.js";

var game = document.getElementById("game");
var ctx = game.getContext("2d");

ctx.imageSmoothingEnabled = false; //PIXEL ART SIĘ NIE ROZMYWA
export const GAME_WIDTH = game.width;
export const GAME_HEIGHT = game.height;

var plr = new Player();
var map = new Map();
var cam = new Camera();

map.loadLevel(1);
plr.resetPosition(map);

document.addEventListener("keydown", (event) =>{//KONTROLA
    const key = event.key.toLowerCase();
    
    if(key === "w" || event.key === "ArrowUp"){
        event.preventDefault();
        plr.move(0,-1,map);
    }
    if(key === "s" || event.key === "ArrowDown"){
        event.preventDefault();
        plr.move(0,1,map);
    }
    if(key === "a" || event.key === "ArrowLeft"){
        event.preventDefault();
        plr.move(-1,0,map);
    }
    if(key === "d" || event.key === "ArrowRight"){
        event.preventDefault();
        plr.move(1,0,map);
    }
})

setInterval(() => {//GŁÓWNA PĘTLA
    cam.updatePosition(plr,TILE_SIZE,GAME_WIDTH,GAME_HEIGHT);
    
    ctx.setTransform(1,0,0,1,0,0)
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    ctx.save();
    ctx.translate(-cam.renderX,-cam.renderY);
    
    buildMap(ctx,map);
    renderPlayer(ctx,plr);

    ctx.restore();
    ctx.setTransform(1,0,0,1,0,0)

    ctx.lineWidth = 10;
    ctx.strokeStyle = "black";
    ctx.strokeRect(0,0,GAME_WIDTH,GAME_HEIGHT);
}, 10);