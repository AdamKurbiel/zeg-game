var game = document.getElementById("game");
var ctx = game.getContext("2d");

//cfg
const GAME_WIDTH = 400
const GAME_HEIGHT = 400
const TILE_SIZE_X = 20
const TILE_SIZE_Y = 20
//

ctx.lineWidth = 5;
ctx.strokeRect(0,0,GAME_WIDTH,GAME_HEIGHT);