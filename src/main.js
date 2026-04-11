import { Map } from "./maps.js";
import { buildMap, renderPlayer } from "./renderer.js";
import { Player } from "./player.js";

var game = document.getElementById("game");
var stats = document.getElementById("stats");
var ctx = game.getContext("2d");

ctx.imageSmoothingEnabled = false; //PIXEL ART SIĘ NIE ROZMYWA
const GAME_WIDTH = game.width;
const GAME_HEIGHT = game.height;

var plr = new Player();
var map = new Map();

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
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    buildMap(ctx,map);

    renderPlayer(ctx,plr);

    stats.innerText = `X: ${plr.x}; Y: ${plr.y}; HP: ${plr.health} WON: ${plr.paused}`;

    ctx.lineWidth = 5;
    ctx.strokeRect(0,0,GAME_WIDTH,GAME_HEIGHT);
}, 10);