import { Map } from "./maps.js";
import { Player } from "./player.js";
import { Camera } from "./camera.js";
import { createKeyboard } from "./input.js";
import { createGame } from "./game.js";

var gameCanvas = document.getElementById("game");
var statsCanvas = document.getElementById("gameStats");

var ctx = gameCanvas.getContext("2d");
var statsCtx = statsCanvas.getContext("2d");

ctx.imageSmoothingEnabled = false; //PIXEL ART SIĘ NIE ROZMYWA

const MAP = new Map();
const PLAYER = new Player();
const CAMERA = new Camera();
const KEYS = createKeyboard();

MAP.loadLevel(1);
PLAYER.resetPosition(MAP);

const GAME = createGame(ctx, statsCtx, gameCanvas, statsCanvas, MAP, PLAYER, CAMERA, KEYS);
GAME.start();
