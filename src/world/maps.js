const maps = {
    1:[
    "####################",
    "#S.....#..........E#",
    "#.###..#..#######..#",
    "#..K#..#.....#.....#",
    "#####..#####.#.###.#",
    "#.B.#..M...#.#...#.#",
    "#.#######..#.###.#.#",
    "#.........<#.....#.#",
    "#..######..#####D#.#",
    "#...............<#.#",
    "####################"],

    2:[
    "####################",
    ".#.................#",
    "#..................#",
    ".#.................#",
    "#..................#",
    ".#.M...........M...#",
    "#..................#",
    ".#.................#",
    "#..................#",
    ".#........S....M...#",
    "#..................#",
    ".#.................#",
    "#..................#",
    ".#.................#",
    "#...............M..#",
    ".#.................#",
    "#..................#",
    ".#.................#",
    "#................E.#",
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
}

Map.prototype.doMapExist = function(index){
    if (index in maps){
        return true;
    }else
        return false;
}

Map.prototype.setCell = function(x,y,type){
    if (this.grid[y][x] == undefined) return;
    this.grid[y][x] = type
}

Map.prototype.getCell = function(x,y){
    return this.grid[y][x];
}


Map.prototype.instantiateEntities = function(entityHandler){
    for (let x = 0; x < this.content().length; x++){

        for (let y = 0; y < this.content()[x].length; y++){
            if (this.content()[x][y] == "<"){
                entityHandler.addEntity("<",x,y);
            }
        }

    }
}
