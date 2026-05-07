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
    "#" : "black",    //# - ściana
    "." : "white",    //. - podłoga
    "M" : "MEDKIT",   //H - Leczenie
    "B" : "BURGER",
    "S" : "blue",     //S - start
    "E" : "red",      //E - wyjście
    "<" : "purple",    //< - przeciwnik ruszający się w bok, gdy trafi na ścianę odbija się w drugą stronę. Zaczyna próbując iść w lewo.
    ">" : "purple"    //> - przeciwnik ruszający się w bok, gdy trafi na ścianę odbija się w drugą stronę. Zaczyna próbując iść w prawo.
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
    BURGER : createImage("assets/textures/golosz-burger.png")
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

export function placeTile(ctx, x, y, style){
    ctx.fillStyle = style;
    ctx.fillRect(
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );
}

export function placeTexture(ctx, x, y, img){
    placeTile(ctx,x,y,TILE_COLORS["."]) //rysujemy pod teksturą podłogęd

    ctx.drawImage(
        img,
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    )
}


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

export function buildMap(ctx, level){
    //Ta funkcja interpretuje mapę na podstawie znaków z poziomu (maps.js)
    let row = 0;

    level.content().forEach(element => {
        let column = 0;

        while(element[column] != undefined){
            var tile = TILE_COLORS[element[column]];

            //Patrz: linijka 4-11
            if (tile == tile.toUpperCase()) placeTexture(ctx, column, row, TEXTURES[tile]); 
            else placeTile(ctx, column, row, tile);

            column++;
        }
        row++;
    });
}