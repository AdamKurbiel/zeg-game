const maps = {
    1:[
    "####################",
    "#......#..........E#",
    "#.###..#..#######..#",
    "#...#..#.....#.....#",
    "###.#..#####.#.###.#",
    "#...#.S....#.#...#.#",
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
    ".#.................#",
    "#..................#",
    ".#.................#",
    "#..................#",
    ".#........S........#",
    "#..................#",
    ".#.................#",
    "#..................#",
    ".#.................#",
    "#..................#",
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