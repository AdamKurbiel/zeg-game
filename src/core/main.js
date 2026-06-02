//©Adam Kurbiel
import { Map } from "../world/maps.js";
import { Player } from "../entities/player.js";
import { Camera } from "../systems/camera.js";
import { createKeyboard } from "../systems/input.js";
import { createGame } from "./game.js";
import { checkHudHover, checkHudClick, checkNotesHover, checkNotesClick } from "../systems/hud.js";
import { EntityHandler } from "../systems/entityHandler.js";
import { AudioSystem } from "../systems/audio.js";

const SMOOTHING_ENABLED = false; //filtrowanie obrazu wyłączone żeby pixelart nie był niewyraźny.

var gameCanvas = document.getElementById("game"); //główny canvas gry
var statsCanvas = document.getElementById("gameStats"); //canvas pokazujący ekwipunek, statystyki oraz opcje.
var notesCanvas = document.getElementById("gameNotes");// canvas na notatki

//kontekst
var ctx = gameCanvas.getContext("2d");
var statsCtx = statsCanvas.getContext("2d");
var notesCtx = notesCanvas.getContext("2d");

//ustawienia z SMOOTHING_ENABLED
ctx.imageSmoothingEnabled = SMOOTHING_ENABLED;
statsCtx.imageSmoothingEnabled = SMOOTHING_ENABLED;
notesCtx.imageSmoothingEnabled = SMOOTHING_ENABLED;


//tworzenie obiektów mapy, gracza, kamery, inputu, systemu bytów, systemu audio.
const MAP = new Map();
const PLAYER = new Player();
const CAMERA = new Camera();
const KEYS = createKeyboard();
const ENTITYHANDLER = new EntityHandler();
const AUDIOSYSTEM = new AudioSystem();


//Import czcionki tiny5
const FONT_TINY = new FontFace('tiny5','url(assets/ui/tiny5.ttf)');
FONT_TINY.load().then((loadedfont) =>{
    window.document.fonts.add(loadedfont);
});
//Import czcionki jersey
const FONT_JERSEY = new FontFace('jersey','url(assets/ui/jersey.ttf)');
FONT_JERSEY.load().then((loadedfont) =>{
    window.document.fonts.add(loadedfont);
});

//stała z nazwami czcionek do innych skryptów
export const FONTNAMES = ["tiny5",'jersey'];


//aktualny poziom
var currentLevel = 3;


//funkcja rozpoczynająca grę
window.startGame = function(){
    document.getElementById("startButton").remove();
    MAP.loadLevel(currentLevel); //ładuje poziom
    MAP.instantiateEntities(ENTITYHANDLER); //ładuje byty
    PLAYER.resetPosition(MAP); //Ustawienie pozycji gracza na START na mapie

    statsCanvas.addEventListener("click", (event) => {
        const rect = statsCanvas.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        checkHudClick(x, y, PLAYER,MAP,ENTITYHANDLER,AUDIOSYSTEM);
    });//sprawdzanie kliknięcia na canvasie ekwipunku

    notesCanvas.addEventListener('mousemove', (event) => {
        const rect = notesCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        checkNotesHover(x, y, PLAYER);
    });

        notesCanvas.addEventListener('click', (event) => {
        const rect = notesCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        checkNotesClick(x, y, PLAYER);
    });

    statsCanvas.addEventListener('mousemove', (event) => {
        const rect = statsCanvas.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        checkHudHover(x,y,statsCtx,PLAYER,AUDIOSYSTEM);
    });//sprawdzanie czy mysz znajduje się na canvasie ekwipunku

    const GAME = createGame(ctx, statsCtx, notesCtx, gameCanvas, statsCanvas, notesCanvas, MAP, PLAYER, CAMERA, KEYS, ENTITYHANDLER, AUDIOSYSTEM);
    GAME.start(); //inicjalizacja gry

}
