const TILE_SIZE = 35;
const TILE_COLORS = {
    "#" : "black",    //# - ściana
    "." : "White",    //. - podłoga
    "S" : "Blue",    //S - start
    "E" : "Red",    //E - wyjście
    "H" : "Green"    //H - leczenie
};
const ANIMATION_DELAY = 15;//opóźnienie między zmianą klatek

const PLAYER_SPRITES  = {
    "IDLE" : createImage("../assets/player/Idle.png"),
    "WALK" : createImage("../assets/player/Walk.png"),
}

function createImage(path){
    var image = new Image();
    image.src = path;
    return image;
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

export function renderPlayer(ctx,player){
    ctx.drawImage(
        PLAYER_SPRITES[player.animationState],
        player.x * TILE_SIZE,
        player.y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );

    if (player.animationState != "IDLE" && player.d < ANIMATION_DELAY){
        player.d++;
        console.log(player.d);
        if (player.d == ANIMATION_DELAY) {
            player.animationState = "IDLE";
            player.d = 0;
        }
    }
}

export function buildMap(ctx, level){
    //Wczytywanie mapy
    let row = 0;
    level.content.forEach(element => {
        let column = 0;
        while(element[column] != undefined){
            placeTile(ctx,column, row, TILE_COLORS[element[column]]);
            column++;
        }
        row++;
    });
}