var game = document.getElementById("game");
var ctx = game.getContext("2d");

//cfg
const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;
const TILE_SIZE = 20;
const TILE_COLORS = {
    "#" : "Black",    //# - ściana
    "." : "White",    //. - podłoga
    "S" : "Blue",    //S - start
    "E" : "Red",    //E - wyjście
    "H" : "Green"    //H - leczenie
};
//

const MAP = [//TODO: Mapy jako osobny plik (.json? osobny plik .js?)
    "####################",
    "#S.....#..........E#",
    "#.###..#..#######..#",
    "#...#..#.....#.....#",
    "###.#..#####.#.###.#",
    "#...#......#.#...#.#",
    "#.#######..#.###.#.#",
    "#.....H....#.....#.#",
    "#..######..#####.#.#",
    "#......K.........#.#",
    "####################"
];

function placeTile(x,y,style){
    ctx.fillStyle = style

    ctx.fillRect(x,y,TILE_SIZE,TILE_SIZE);
}

function buildMap(level){
    //Wczytywanie mapy
    //Mapa nie musi być kwadratem :)

    let row = 0;
    level.forEach(element => {
        let column = 0;
        while(element[column] != undefined){
            placeTile(row * TILE_SIZE, column * TILE_SIZE, TILE_COLORS[element[column]]);
            column++;
        }

        row++;
    });
}


buildMap(MAP);

ctx.lineWidth = 5;
ctx.strokeRect(0,0,GAME_WIDTH,GAME_HEIGHT);