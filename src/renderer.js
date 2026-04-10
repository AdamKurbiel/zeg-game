const TILE_SIZE = 35;
const TILE_COLORS = {
    "#" : "Black",    //# - ściana
    "." : "White",    //. - podłoga
    "S" : "Blue",    //S - start
    "E" : "Red",    //E - wyjście
    "H" : "Green"    //H - leczenie
};

export function placeTile(ctx, x,y,style){
    ctx.fillStyle = style
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

export function buildMap(ctx, level){
    //Wczytywanie mapy
    //Mapa nie musi być kwadratem :)
    let row = 0;
    level.forEach(element => {
        let column = 0;
        while(element[column] != undefined){
            placeTile(ctx,column, row, TILE_COLORS[element[column]]);
            column++;
        }
        row++;
    });
}