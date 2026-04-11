import { getMap } from "./maps.js";
import { buildMap, renderPlayer } from "./renderer.js";
import { Player } from "./player.js";

var game = document.getElementById("game");
var ctx = game.getContext("2d");

var current_map = 1;

const GAME_WIDTH = game.width;
const GAME_HEIGHT = game.height;

var plr = new Player();
var map = getMap(current_map);

document.addEventListener("keydown", (event) =>{//KONTROLA
    const key = event.key.toLowerCase();

    if(event.key === "w" || event.key === "ArrowUp"){
        plr.move(0,-1,map);
    }
    if(event.key === "s" || event.key === "ArrowDown"){
        plr.move(0,1,map);
    }
    if(event.key === "a" || event.key === "ArrowLeft"){
        plr.move(-1,0,map);
    }
    if(event.key === "d" || event.key === "ArrowRight"){
        plr.move(1,0,map);
    }
})

setInterval(() => {//GŁÓWNA PĘTLA
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    buildMap(ctx,map);

    renderPlayer(ctx,plr);

    ctx.lineWidth = 5;
    ctx.strokeRect(0,0,GAME_WIDTH,GAME_HEIGHT);
}, 10);