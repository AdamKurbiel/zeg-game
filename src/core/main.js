//©Adam Kurbiel
import { Map } from "../world/maps.js";
import { Player } from "../entities/player.js";
import { Camera } from "../systems/camera.js";
import { createKeyboard } from "../systems/input.js";
import { createGame } from "./game.js";

const SMOOTHING_ENABLED = false; //filtrowanie

var gameCanvas = document.getElementById("game");
var statsCanvas = document.getElementById("gameStats");

var ctx = gameCanvas.getContext("2d");
var statsCtx = statsCanvas.getContext("2d");
ctx.imageSmoothingEnabled = SMOOTHING_ENABLED;

const MAP = new Map();
const PLAYER = new Player();
const CAMERA = new Camera();
const KEYS = createKeyboard();

MAP.loadLevel(1);
PLAYER.resetPosition(MAP); //Ustawienie pozycji gracza na START na mapie


const GAME = createGame(ctx, statsCtx, gameCanvas, statsCanvas, MAP, PLAYER, CAMERA, KEYS);
GAME.start();
