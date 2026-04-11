export const TILE_SIZE = 40;
const TILE_COLORS = {
    "#" : "black",    //# - ściana
    "." : "White",    //. - podłoga
    "S" : "Blue",    //S - start
    "E" : "Red",    //E - wyjście
    "H" : "Green"    //H - leczenie
};
const ANIMATION_DELAY = 150;//opóźnienie między zmianą klatek

const PLAYER_SPRITES  = {
    "IDLE" : createImage("assets/player/Idle.png"),
    "WALK0" : createImage("assets/player/Walk0.png"),
    "WALK1" : createImage("assets/player/Walk1.png"),
}

function createImage(path){
    var image = new Image();
    image.src = path;
    return image;
}

function lerp (start, end, t){
    return start * (1 - t) + end * t;
}

export function placeTile(ctx, x,y,style){
    ctx.fillStyle = style
    ctx.fillRect(
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );
}

export function renderPlayer(ctx,player,ease,now){
    player.renderX = lerp(player.renderX,player.x,ease);
    player.renderY = lerp(player.renderY,player.y,ease);
    ctx.drawImage(
        PLAYER_SPRITES[player.animationState],
        player.renderX * TILE_SIZE,
        player.renderY * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );


    if (player.animationState !== "IDLE"){
        console.log("IDLE");
    }
}

export function buildMap(ctx, level){
    //Wczytywanie mapy
    let row = 0;
    level.content().forEach(element => {
        let column = 0;
        while(element[column] != undefined){
            placeTile(ctx,column, row, TILE_COLORS[element[column]]);
            column++;
        }
        row++;
    });
}