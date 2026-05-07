//©Adam Kurbiel
import { Map } from "../world/maps.js";
import { Player } from "../entities/player.js";
import { Camera } from "../systems/camera.js";
import { createKeyboard } from "../systems/input.js";
import { createGame } from "./game.js";
import { checkHudHover, checkHudClick} from "../systems/hud.js";
import { EntityHandler } from "../systems/entityHandler.js";

const SMOOTHING_ENABLED = false; //filtrowanie

var gameCanvas = document.getElementById("game");
var statsCanvas = document.getElementById("gameStats");

var ctx = gameCanvas.getContext("2d");
var statsCtx = statsCanvas.getContext("2d");
ctx.imageSmoothingEnabled = SMOOTHING_ENABLED;
statsCtx.imageSmoothingEnabled = SMOOTHING_ENABLED;

const MAP = new Map();
const PLAYER = new Player();
const CAMERA = new Camera();
const KEYS = createKeyboard();
const ENTITYHANDLER = new EntityHandler();
var currentLevel = 1;

MAP.loadLevel(currentLevel);
MAP.instantiateEntities(ENTITYHANDLER);
PLAYER.resetPosition(MAP); //Ustawienie pozycji gracza na START na mapie

statsCanvas.addEventListener("click", (event) => {
    const rect = statsCanvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    checkHudClick(x, y, PLAYER,MAP,ENTITYHANDLER);
});

statsCanvas.addEventListener('mousemove', (event) => {
    const rect = statsCanvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    checkHudHover(x,y,statsCtx,PLAYER);
});


const GAME = createGame(ctx, statsCtx, gameCanvas, statsCanvas, MAP, PLAYER, CAMERA, KEYS, ENTITYHANDLER);
GAME.start();
