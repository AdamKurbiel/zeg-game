
import { isEntity } from "./entityHandler.js";

export const TILE_SIZE = 50;

/*
TILE_COLORS przechowuje informacje o znakach które występują na mapie (w maps.js) i na podstawie nich
zapisuje im konkretny kolor/styl.

Jeżeli chcemy ustawić konkretny znak na kolor, piszemy to z małych liter.
np. jeśli chcemy żeby ściana miała kolor czarny, ustawiamy # na "black".

Natomiast jeśli zamiast koloru, chcemy mieć konkretną teksturę, piszemy to z dużych liter. 
np. jeśli chcemy żeby leczenie miało teksturę medkit.png, ustawiamy H na "MEDKIT". 
*/
const TILE_COLORS = {
    "#" : "TREE1",    //# - ściana
    "$" : "TREE2",    //# - ściana
    "." : "GRASS1",    //. - podłoga
    ";" : "GRASS2",    //. - podłoga
    "M" : "MEDKIT",   //H - Leczenie
    "B" : "BURGER",
    "S" : "GRASS2",     //S - start
    "E" : "red",      //E - wyjście
    "K" : "KEY", //Klucz do drzwi 
    "D" : "DOORS", //drzwi
    "N" : "PAPERNOTES", //notatki
    "C" : "CHEST_MATH",    //skrzynka zamknięta
    "O" : "CHEST_MATH_OPEN",  //skrzynka otwarta 
    "P" : "SPIDER0",
    "Q" : "CRYSTAL_BLUE",
    "R" : "CRYSTAL_PINK",
    "U" : "CRYSTAL_ORANGE",
    "X" : "LAB_DOOR",
    "Y" : "CANDY",    //Y - Cukierek
    "W" : "SUSSY_POWDER",  //W - Podejrzany proszek
    // Lasery
    "1" : "LASER_RED",
    "2" : "LASER_BLUE",
    "3" : "LASER_GREEN",
    "4" : "LASER_PURPLE",
    "5" : "LASER_ORANGE",
    // Przyciski (wyłączają odpowiadający laser)
    "6" : "BUTTON_RED",
    "7" : "BUTTON_BLUE",
    "8" : "BUTTON_GREEN",
    "9" : "BUTTON_PURPLE",
    "0" : "BUTTON_ORANGE",
    //stoły w labie
    "A" : "LAB_TABLE_S1",
    "F" : "LAB_TABLE_S2",
    "G" : "LAB_TABLE_S3",
    "H" : "LAB_TABLE_S4",
    "I" : "LAB_TABLE_S5",

    "J" : "LAB_WALL",

    "Z" : "LAB_FLOOR_S1",
    "!" : "LAB_FLOOR_S2",

    "*" : "LAB_FLOOR_S1",//* start laboratoryjny

    "@" : "CHEST",
    ")" : "CHEST_OPEN",
};




export const TEXTURES = {
    //ANIMACJE GRACZA
    IDLE : createImage("assets/player/Idle.png"),
    WALK0 : createImage("assets/player/Walk0.png"),
    WALK1 : createImage("assets/player/Walk1.png"),

    //UI
    HEART : createImage("assets/ui/heart_icon.png"),
    INVENTORY_SLOT : createImage("assets/ui/inventory_slot.png"),

    //TEKSTURY W GRZE
    MEDKIT : createImage("assets/textures/medkit.png"),
    BURGER : createImage("assets/textures/golosz-burger.png"),
    DOORS : createImage("assets/textures/doors.png"),
    KEY : createImage("assets/textures/key.png"),
    PAPERNOTES : createImage("assets/textures/paper-notes.png"),
    
    CHEST_MATH : createImage("assets/textures/chest-math.png"),     
    CHEST_MATH_OPEN : createImage("assets/textures/chest-math-open.png"),

    GRASS1 : createImage("assets/textures/grass1.png"),
    GRASS2 : createImage("assets/textures/grass2.png"),

    TREE1 : createImage("assets/textures/TREE1.png"),
    TREE2 : createImage("assets/textures/TREE2.png"),

    //BYTY W GRZE
    BAT0: createImage("assets/textures/bat0.png"),
    BAT1: createImage("assets/textures/bat1.png"),

    SPIDER0 : createImage("assets/textures/enemy-spider-s1.png"),
    SPIDER1 : createImage("assets/textures/enemy-spider-s2.png"),

    SPIDER_BACK0  : createImage("assets/textures/spider-back-s1.png"),
    SPIDER_BACK1  : createImage("assets/textures/spider-back-s2.png"),
    SPIDER_FRONT0 : createImage("assets/textures/spider-front-s1.png"),
    SPIDER_FRONT1 : createImage("assets/textures/spider-front-s2.png"),

    SPIKES1 : createImage("assets/textures/spikes-s1.png"), // faza 0 bezpieczna
    SPIKES2 : createImage("assets/textures/spikes-s2.png"), // faza 1 niebezpieczna
    SPIKES3 : createImage("assets/textures/spikes-s3.png"), // faza 2 niebezpieczna

    CRYSTAL_BLUE   : createImage("assets/textures/crystal-blue.png"),
    CRYSTAL_PINK   : createImage("assets/textures/crystal-pink.png"),
    CRYSTAL_ORANGE : createImage("assets/textures/crystal-orange.png"),
    LAB_DOOR       : createImage("assets/textures/lab-door.png"),

    CANDY        : createImage("assets/textures/candy.png"),
    SUSSY_POWDER : createImage("assets/textures/sussy-powder.png"),

    LASER_RED    : createImage("assets/textures/laser-red.png"),
    LASER_BLUE   : createImage("assets/textures/laser-blue.png"),
    LASER_GREEN  : createImage("assets/textures/laser-green.png"),
    LASER_PURPLE : createImage("assets/textures/laser-purple.png"),
    LASER_ORANGE : createImage("assets/textures/laser-orange.png"),

    BUTTON_RED    : createImage("assets/textures/button-red.png"),
    BUTTON_BLUE   : createImage("assets/textures/button-blue.png"),
    BUTTON_GREEN  : createImage("assets/textures/button-green.png"),
    BUTTON_PURPLE : createImage("assets/textures/button-purple.png"),
    BUTTON_ORANGE : createImage("assets/textures/button_orange.png"),

    LAB_TABLE_S1 : createImage("assets/textures/lab-table-s1.png"),
    LAB_TABLE_S2 : createImage("assets/textures/lab-table-s2.png"),
    LAB_TABLE_S3 : createImage("assets/textures/lat-table-s3.png"),
    LAB_TABLE_S4 : createImage("assets/textures/lab-table-s4.png"),
    LAB_TABLE_S5 : createImage("assets/textures/lab-table-s5.png"),

    LAB_WALL    : createImage("assets/textures/lab-wall.png"),
    LAB_FLOOR_S1 : createImage("assets/textures/lab-floor-s1.png"),
    LAB_FLOOR_S2 : createImage("assets/textures/lab-floor-s2.png"),

    CHEST : createImage("assets/textures/chest.png"),
    CHEST_OPEN : createImage("assets/textures/chest-open.png"),
}

//TODO: ZMIENIĆ PLACEHOLDEROWE KOLORY NA TEKSTURY
//Podłoga będzie musiała być rysowana zawsze POD innymi blokami (oprócz ściany).


//Ta funkcja zwraca obiekt obrazu (Image) na podstawie podanej ścieżki pliku.
function createImage(path){
    var image = new Image();
    image.src = path;
    return image;
}

//do płynnego poruszania się
function lerp (start, end, t){
    return start * (1 - t) + end * t;
}

//funkcja renderująca kafelek
export function placeTile(ctx, x, y, style){
    ctx.fillStyle = style;
    ctx.fillRect(
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );
}

//funkcja renderująca teksturę (obrazek)
export function placeTexture(ctx, x, y, img, withGrass = true, floorImg = null){
    if (withGrass) {
        ctx.drawImage(
            floorImg || TEXTURES.GRASS1,
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
        )
    }
    ctx.drawImage(
        img,
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    )
}

//funkcja renderująca gracza
export function renderPlayer(ctx,player,ease){
    player.renderX = lerp(player.renderX,player.x,ease);
    player.renderY = lerp(player.renderY,player.y,ease);
    ctx.drawImage(
        TEXTURES[player.animationState],
        player.renderX * TILE_SIZE,
        player.renderY * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );
}

const FLOOR_TEXTURE_FOR = {
    "." : "GRASS1",
    ";" : "GRASS2",
    "S" : "GRASS2",
    "Z" : "LAB_FLOOR_S1",
    "!" : "LAB_FLOOR_S2",
};

// Zwraca teksturę podłogi jaka powinna być pod bytem na danej pozycji
function getFloorTextureAt(map, x, y) {
    if (!map) return TEXTURES.GRASS1;

    const self = map.getCell(x, y);
    if (self === "Z" || self === "!") return TEXTURES.LAB_FLOOR_S1;

    const neighbors = [
        map.getCell(x + 1, y),
        map.getCell(x - 1, y),
        map.getCell(x, y + 1),
        map.getCell(x, y - 1),
    ];

    for (const cell of neighbors) {
        if (cell === "Z" || cell === "!" || cell === "J" ||
            cell === "A" || cell === "F" || cell === "G" || cell === "H" || cell === "I") {
            return TEXTURES.LAB_FLOOR_S1;
        }
    }

    return TEXTURES.GRASS1;
}

function drawEntity(ctx, i, entityInfo, map) {

    var entityAnimation = entityInfo.Frames;
    var currentFrame = i.frame;
    
    if (i.symbol === "V") {
        if (i.direction === -1) {
            entityAnimation = ["SPIDER_BACK0", "SPIDER_BACK1"];
        } else {
            entityAnimation = ["SPIDER_FRONT0", "SPIDER_FRONT1"];
        }
    }

    const drawsFloor = (i.symbol === "T" || i.symbol === "V");
    if (drawsFloor) {
        const floorTexture = getFloorTextureAt(map, i.x, i.y);
        ctx.drawImage(floorTexture,
            i.x * TILE_SIZE, i.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    i.renderX = lerp(i.renderX, i.x, 0.175);
    i.renderY = lerp(i.renderY, i.y, 0.30);

    var drawX = i.renderX * TILE_SIZE + entityInfo.XOffset;
    var drawY = i.renderY * TILE_SIZE + entityInfo.YOffset;
    var drawW = entityInfo.WidthScale * TILE_SIZE;
    var drawH = entityInfo.HeightScale * TILE_SIZE;

    if (i.direction !== undefined && i.direction === 1) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(TEXTURES[entityAnimation[currentFrame]],
            -drawX - drawW, drawY, drawW, drawH);
        ctx.restore();
    } else {
        ctx.drawImage(TEXTURES[entityAnimation[currentFrame]],
            drawX, drawY, drawW, drawH);
    }
}



export function renderGroundEntities(ctx, entityHandler, map) {
    for (let i of entityHandler.entities) {
        if (i.symbol !== "T" && i.symbol !== "V") continue;
        drawEntity(ctx, i, entityHandler.getEntityInfo(i.symbol), map);
    }
}

export function renderAirEntities(ctx, entityHandler, map) {
    for (let i of entityHandler.entities) {
        if (i.symbol === "T") continue;
        if (i.symbol === "V") continue;
        drawEntity(ctx, i, entityHandler.getEntityInfo(i.symbol), map);
    }
}

export function buildMap(ctx, level, map){
    let row = 0;

    level.content().forEach(element => {
        let column = 0;

        while(element[column] != undefined){
            var tile = TILE_COLORS[element[column]];

            const floorTile = map && map.floorGrid && map.floorGrid[row] 
                ? map.floorGrid[row][column] 
                : null;
            const floorImg = (floorTile === "Z" || floorTile === "!") 
                ? TEXTURES.LAB_FLOOR_S1 
                : TEXTURES.GRASS1;

            if (isEntity(element[column]) == true){
                ctx.drawImage(floorImg, column * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }else{
                if (tile && tile == tile.toUpperCase()){
                    const noGrass = ["Z", "!", "J"];
                    placeTexture(ctx, column, row, TEXTURES[tile], !noGrass.includes(tile), floorImg);
                }else{
                    placeTile(ctx, column, row, tile);
                }
            }

            column++;
        }
        row++;
    });
}
