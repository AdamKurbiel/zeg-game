import { isEntity } from "../systems/entityHandler.js";

const maps = {
    1:[
    "####$###############",
    "#S...#K....#.##....#",
    "####.###.#.#..^.#..#",
    "#..#...##..#.#.###.#",
    "##.##<.....###..#..#",
    "##..#.##..#..#..##.E#",
    "###...#####.##.#...#",
    "#.#.####....#..###.#",
    "#.#......#####...#.#",
    "#.##.###.#...###.#.#",
    "#....#...#.#...#.###",
    "#N##.#####.##......#",
    "###.....##..##.###.#",
    "#...#.#D###..#.#...#",
    "###.#.#...#..#.#####",
    "#...#.#.....##.....#",
    "####################",
],


    2:[
    "#######################",
    "#..........######....##",
    "######.#####....###...E",
    "#..#.........##...#.###",
    "#.##..#.#.#######.#..##",
    "#....##.#.#.....#.##..#",
    "####.#..###.##..#..##.#",
    "#S.#.........#..##..#.#",
    "##.###.####..#...##.#.#",
    "#....#....##.#.#..#.#.#",
    "#..#.#.##.####..#.#...#",
    "#..##...###..##.#.#.#.#",
    "#.....#.......#.###.#.#",
    "####..####.####..#..#.#",
    "#..#.#.......#...####.#",
    "#..#.#.###...###.#..#.#",
    "#.##.###...#...#.##.#.#",
    "#.....#...##.#....#...#",
    "#######################",
]
};

export const notes = {
    1: "elo to test notatki"
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

    let i;
    for (i in this.grid){
        let row = this.grid[i];
        let j;
        for (j in row){
            if (row[j] == "#"){
                let randomInt = Math.floor(Math.random() * 2) + 1; //1 lub 2
                if (randomInt == 1){
                    row[j] = "$";
                }
            }

            if (row[j] == "."){
                let randomInt = Math.floor(Math.random() * 4) + 1; //1 lub 2
                if (randomInt == 1){
                    row[j] = ";";
                }
            }
        }
    }
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
            if (isEntity(this.content()[x][y])){
                entityHandler.addEntity(this.content()[x][y],x,y);
            }
        }

    }
}
