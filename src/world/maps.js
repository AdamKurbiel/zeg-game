const maps = {
    1:[
    "####################",
    "#S.....#..........E#",
    "#.###..#..#######..#",
    "#...#..#.....#.....#",
    "###.#..#####.#.###.#",
    "#...#......#.#...#.#",
    "#.#######..#.###.#.#",
    "#.....H....#.....#.#",
    "#..######..#####.#.#",
    "#................#.#",
    "####################"],

    2:[
    "####################",
    ".#.................#",
    "#..................#",
    ".#.................#",
    "#..................#",
    ".#.H...........H...#",
    "#..................#",
    ".#.................#",
    "#..................#",
    ".#........S....H...#",
    "#..................#",
    ".#.................#",
    "#..................#",
    ".#.................#",
    "#...............H..#",
    ".#.................#",
    "#..................#",
    ".#.................#",
    "#..................#",
    ".###################"
]
};

export function getMap(index){
    return maps[index].map(row => row.split(""));
};

export function Map(){
    this.level = 1;
    this.grid = getMap(this.level);
};

Map.prototype.findFirstBlock = function(type){
    for(let i = 0; i < this.content().length; i++){
        for (let j in this.content()[i]){
            if (this.content()[i][j] == type){
                return [parseInt([i]),parseInt([j])];
            }
        }
    }
    return false;
}

//Instancja mapy wczytuje się raz i jest możliwa do edycji (usuwanie przedmiotów itd.)

Map.prototype.loadLevel = function(level){
    this.level = level;
    this.grid = getMap(this.level);
}

Map.prototype.content = function(){
    return this.grid;
}

Map.prototype.clearRow = function(x,y){

    this.grid[y][x] = ".";
    console.log(this.grid);
}