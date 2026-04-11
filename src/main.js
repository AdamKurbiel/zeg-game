import { Map } from "./maps.js";
import { buildMap, renderPlayer, TILE_SIZE} from "./renderer.js";
import { Player } from "./player.js";
import { Camera } from "./camera.js";


var game = document.getElementById("game");
var gameStats = document.getElementById("gameStats");

var ctx = game.getContext("2d");
var gameStatsCtx = gameStats.getContext("2d");
var inGame = true;

ctx.imageSmoothingEnabled = false; //PIXEL ART SIĘ NIE ROZMYWA
const GAME_WIDTH = game.width;
const GAME_HEIGHT = game.height;
const MOVE_DELAY = 150;
const MOVE_EASING = 0.125;
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
function step(now) {
    if (!inGame) return;
    gameStatsCtx.fillStyle = "#2B1A4F";
    gameStatsCtx.fillRect(0,0,gameStats.width,gameStats.height);

    cam.updatePosition(plr, TILE_SIZE, GAME_WIDTH, GAME_HEIGHT);

    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    plr.update(KEYS,map,now,MOVE_DELAY);

    ctx.save();
    ctx.translate(-cam.renderX, -cam.renderY);

    buildMap(ctx, map);
    renderPlayer(ctx, plr, MOVE_EASING);

    ctx.restore();

    ctx.lineWidth = 10;
    ctx.strokeStyle = "black";
    ctx.strokeRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    requestAnimationFrame(step);
}

requestAnimationFrame(step);