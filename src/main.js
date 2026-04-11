import { Map } from "./maps.js";
import { buildMap, renderPlayer, TILE_SIZE} from "./renderer.js";
import { Player } from "./player.js";
import { Camera } from "./camera.js";

var game = document.getElementById("game");
var ctx = game.getContext("2d");

ctx.imageSmoothingEnabled = false; //PIXEL ART SIĘ NIE ROZMYWA
const GAME_WIDTH = game.width;
const GAME_HEIGHT = game.height;
const MOVE_DELAY = 150;
const KEYS = {
    w: false,
    a: false,
    s: false,
    d: false,
};

var plr = new Player();
var map = new Map();
var cam = new Camera();

map.loadLevel(1);
plr.resetPosition(map);

document.addEventListener("keydown", (event) =>{//KONTROLA
    const key = event.key.toLowerCase();

    if (key in KEYS){
        KEYS[key] = true;
        event.preventDefault();
    }
});

document.addEventListener("keyup",(event) =>{
    const key = event.key.toLowerCase();

    if (key in KEYS){
        KEYS[key] = false;
        event.preventDefault();
    }
})

let moveCooldown = 0;
setInterval(() => {//GŁÓWNA PĘTLA
    const now = Date.now();
    cam.updatePosition(plr,TILE_SIZE,GAME_WIDTH,GAME_HEIGHT);
    
    ctx.setTransform(1,0,0,1,0,0)
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    if (now - moveCooldown > MOVE_DELAY){
        let dx = 0;
        let dy = 0;

        if (KEYS.w) dy -= 1;
        if (KEYS.s) dy += 1;
        if (KEYS.a) dx -= 1;
        if (KEYS.d) dx += 1;

        if (dx !== 0 || dy !== 0){
            plr.move(dx,dy,map);
            moveCooldown = now;
        }
    }



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