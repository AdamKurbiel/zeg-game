import { isEntity } from "../systems/entityHandler.js";

const maps = {
    1:[
    "####$###############",
    "#S...#K....#.##..T.#",
    "####.###.#.#..^.#..#",
    "#..#...##..#.#.###.#",
    "##.##<.....###..#..#",
    "##..#.##..#.C#..##.E#",
    "###...#####.##.#...#",
    "#.#.####....#..###.#",
    "#.#.T....#####...#.#",
    "#.##.###.#...###.#.#",
    "#....#...#.#...#.###",
    "#N##.#####.##......#",
    "###.....##..##.###.#",
    "#...#.#D###T.#.#...#",
    "###.#.#...#..#T#####",
    "#...#.#.....##.....#",
    "####################",
],


    2:[
    "#######################",
    "#U...T.....######....##",
    "######.#####....###T..E#",
    "#..#P........##...#.###",
    "#.##..#.#.#######.#..##",
    "#....##.#N#.....#.##..#",
    "####.#..###.##..#..##.#",
    "#S.#.........#^.##..#.#",
    "##^###.####..#...##.#.#",
    "#....#....##.#.#..#.#.#",
    "#..#.#.##.####..#.#...#",
    "#..##.T.###..##.#.#.#.#",
    "#.....#P......#.###.#.#",
    "####..####.####..#..#.#",
    "#..#.#......Q#..T####.#",
    "#.R#.#.###...###.#..#.#",
    "#.#...##...#...#.##.#.#",
    "#<....#...##.#....#...#",
    "#######################",
],
    3:[
        "############################E#",
        "#...........#########....#...#",
        "#...#######.T.....V##.T..###.#",
        "#<.....##.#.######.#..##.....#",
        "#.##.#....#.#..#...#.######..#",
        "#..#.#.#.##.#.###..#...#######",
        "#.N#.#.#..#.#...##.##.......##",
        "####.#.##.#......#..#.#####.##",
        "#....#..#.######.#..#.#..##.##",
        "##.###..#..#.#.#.#.##.#.##..##",
        "#..#VT..##.#.....######....###",
        "#.##.#...#.###.#.#....#.##.###",
        "#..#.###.#..#..#T..#.##..#..V#",
        "##.#...#.#..#..#.###..######.#",
        "#....###.#######..##.#...T...#",
        "########.#..#.##....##.#####.#",
        "#S....##.##<.....#.#.......#.#",
        "###.#.##..#.##.#####.#######.#",
        "#...#.T...#..#.......##...#..#",
        "#.##########.#.......#..#....#",
        "##############################"
],
    4:[
        "JJJJJJJJJJJJJJJJJJJJJJJJJJ",
        "J,LLLLLL,,,,,L,,,LL,,,,LLJ",
        "J,L,,,,,,LLLLL,LLLLL,LLLLJ",
        "J,L,L,,,,,,,,,,,,,,L,L,LLJ",
        "J,L,LLLLL,,LLLLLLL,LT,,L,J",
        "J,T,,,,,LL,,,,,,L,,L,LLL,J",
        "J,LLLLL,,LLLLL,,L,,,,,,,,J",
        "JLL,,,L,T,,,,,,,LL,,LLL,,J",
        "J,,,LLLT,,,,LLL,LLLLLLLLLJ",
        "J,LL,L,LLLL,LLL,L,,,LL,,,J",
        "J,,,,,,,,,,,LLL,L,L,,,,L,J",
        "JL,LLL,LLL,LLL,,L,LTLLLL,J",
        "JL,L,,,L,,L,,,,,L,L,,L,L,J",
        "JL,L,L,,,LL,LLLLLLL,LL,,,J",
        "JLTLLLLLLLL,,,TTT,,,,LLLLJJJJJ",
        "JLTL,,,,,LLLLLLLLLLL,L,,,J,T,J",
        "J,,L,LLL,LL,,,LL,,,,,L,L,JT,TJ",
        "J,,,,,,L,T,,L,TL,LLL,LTJJJ,T,E",
        "JLLL,L,L,LLLL,LL,,,L,,,,T,T,TJ",
        "J,,,,L,L,L,,,,L,,L,LLL,JJT,T,J",
        "JJJJJJJJ*JJJJJJJJJJJJJJJJJJJJJ",
        "JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ"


    ]

};
// notatki treść
export const notes = {
    1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae imperdiet tellus, a euismod orci. Integer aliquam .",
    2: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae imperdiet tellus, a euismod orci. Integer aliquam ."
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

Map.prototype.findStart = function(){
    return this.findFirstBlock("S") || this.findFirstBlock("*");
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

            // L = stol laboratoryjny losuje jeden z 5 rodzaji
            if (row[j] == "L") {
                const labTableVariants = ["A", "F", "G", "H", "I"];
                row[j] = labTableVariants[Math.floor(Math.random() * labTableVariants.length)];
            }
        

            if (row[j] == ",") {
                const labFloorVariants = ["Z", "!"];
                row[j] = labFloorVariants[Math.floor(Math.random() * labFloorVariants.length)];
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
