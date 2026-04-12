//©Adam Kurbiel
import { Map } from "../world/maps.js";
import { Player } from "../entities/player.js";
import { Camera } from "../systems/camera.js";
import { createKeyboard } from "../systems/input.js";
import { createGame } from "./game.js";
import { checkResetBtn_click } from "../systems/hud.js";

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
var currentLevel = 1;

MAP.loadLevel(currentLevel);
PLAYER.resetPosition(MAP); //Ustawienie pozycji gracza na START na mapie

statsCanvas.addEventListener("click", (e) => {
    const rect = statsCanvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    PLAYER.health = 3;
    MAP.loadLevel(currentLevel);
    checkResetBtn_click(x, y, PLAYER,MAP);
});

const GAME = createGame(ctx, statsCtx, gameCanvas, statsCanvas, MAP, PLAYER, CAMERA, KEYS);
GAME.start();
