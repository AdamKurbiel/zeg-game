import { getMap, Map } from "./maps.js";
import { buildMap, renderPlayer } from "./renderer.js";
import { Player } from "./player.js";

var game = document.getElementById("game");
var stats = document.getElementById("stats");
var ctx = game.getContext("2d");



const GAME_WIDTH = game.width;
const GAME_HEIGHT = game.height;

var plr = new Player();
var map = new Map();

document.addEventListener("keydown", (event) =>{//KONTROLA
    const key = event.key.toLowerCase();

    if(event.key === "w" || event.key === "ArrowUp"){
        plr.move(0,-1,map.content);
    }
    if(event.key === "s" || event.key === "ArrowDown"){
        plr.move(0,1,map.content);
    }
    if(event.key === "a" || event.key === "ArrowLeft"){
        plr.move(-1,0,map.content);
    }
    if(event.key === "d" || event.key === "ArrowRight"){
        plr.move(1,0,map.content);
    }
})

setInterval(() => {//GŁÓWNA PĘTLA
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    buildMap(ctx,map);

    renderPlayer(ctx,plr);

    stats.innerText = `X: ${plr.x}; Y: ${plr.y}; HP: ${plr.health}`;

    ctx.lineWidth = 5;
    ctx.strokeRect(0,0,GAME_WIDTH,GAME_HEIGHT);
}, 10);