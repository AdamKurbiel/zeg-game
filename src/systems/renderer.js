
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
    "N" : "PAPERNOTES" //notatki
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
    
    GRASS1 : createImage("assets/textures/grass1.png"),
    GRASS2 : createImage("assets/textures/grass2.png"),

    TREE1 : createImage("assets/textures/TREE1.png"),
    TREE2 : createImage("assets/textures/TREE2.png"),

    //BYTY W GRZE
    BAT0: createImage("assets/textures/bat0.png"),
    BAT1: createImage("assets/textures/bat1.png"),

    SPIKES1 : createImage("assets/textures/spikes-s1.png"), // faza 0 bezpieczna
    SPIKES2 : createImage("assets/textures/spikes-s2.png"), // faza 1 niebezpieczna
    SPIKES3 : createImage("assets/textures/spikes-s3.png"), // faza 2 niebezpieczna
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
export function placeTexture(ctx, x, y, img){
    ctx.drawImage(
        TEXTURES.GRASS1,
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    )

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

//funkcja renderująca byty
export function renderEntities(ctx,entityHandler){
    for (let i of entityHandler.entities){
        var entityInfo = entityHandler.getEntityInfo(i.symbol);
        var entityAnimation = entityInfo.Frames;
        var currentFrame = i.frame;
        
        //console.log(`Entity info:\nname: ${entityInfo.Name},\nAnimation frames: ${entityAnimation},\nCurrent frame: ${currentFrame}`);

        ctx.drawImage(
            TEXTURES.GRASS1,
            i.x * TILE_SIZE,
            i.y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
        );

        i.renderX = lerp(i.renderX,i.x,0.175);
        i.renderY = lerp(i.renderY,i.y,0.30);

        ctx.drawImage(
            TEXTURES[entityAnimation[currentFrame]],
            i.renderX * TILE_SIZE + entityInfo.XOffset,
            i.renderY * TILE_SIZE + entityInfo.YOffset,
            entityInfo.WidthScale * TILE_SIZE,
            entityInfo.HeightScale * TILE_SIZE
        );

    }
}

export function buildMap(ctx, level){
    //Ta funkcja interpretuje mapę na podstawie znaków z poziomu (maps.js)
    let row = 0;

    level.content().forEach(element => {
        let column = 0;

        while(element[column] != undefined){
            var tile = TILE_COLORS[element[column]];

            if (isEntity(element[column]) == true){
                placeTile(ctx,column,row,"white");
            }else{
                //Patrz: linijka 4-11


                if (tile == tile.toUpperCase()){

                    placeTexture(ctx, column, row, TEXTURES[tile]);
                }else{
                    placeTile(ctx, column, row, tile);
                }
            }

            column++;
        }
        row++;
    });
}
