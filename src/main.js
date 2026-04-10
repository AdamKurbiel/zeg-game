import { getMap } from "./maps.js";
import { buildMap } from "./renderer.js";

var game = document.getElementById("game");
var ctx = game.getContext("2d");

const GAME_WIDTH = game.width;
const GAME_HEIGHT = game.height;
var current_map = 1;


setInterval(() => {
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    buildMap(ctx,getMap(current_map));
    

    ctx.lineWidth = 5;
    ctx.strokeRect(0,0,GAME_WIDTH,GAME_HEIGHT);
}, 10);




