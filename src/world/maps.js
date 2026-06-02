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
    "##.#..####.####..#..#.#",
    "#..#.#......Q#..T####.#",
    "#.R#.#.###...###.#..#.#",
    "#.#...##...#...#.##.#.#",
    "#<....#...##.#....#...#",
    "#######################",
],
    3:[
        "########################JJJJEJ",
        "#...........#########....#.JXJ",
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
        "J,LLLLLL,,,,,L,,,LL,,,NLLJ",
        "J,L,,,,,,LLLLL,LLLLL,LLLLJ",
        "J,L,L,,,,,,,,,,,,,,L,L,LLJ",
        "J,L,LLLLL,,LLLLLLL,LT,,L,J",
        "J,T,,,,,LL,,,,,,L,,L,LLL,J",
        "J,LLLLL,,LLLLL,,L,,,,,,,,J",
        "JLL,,BL,T,,,,,,,LL,,LLL,,J",
        "J,,,LLLT,,,,LLL,LLLLLLLLLJ",
        "J,LL,L,LLLL,LLL,L,,,LL,,,J",
        "J,,,,,,,,,,,LLL,L,L,,,,L,J",
        "JL,LLL,LLL,LLL,,L,LTLLLL,J",
        "JL,L,,,L,,L,,,,,L,L,,L,L,J",
        "JL,L,L,,,LL,LLLLLLL,LL,,,J",
        "JLTLLLLLLLL,,,T,DT,,,,LLLLJJJJJ",
        "JLTL,,,,,LLLLLLLLLLL,L,,,J,T,J",
        "J,,L,LLL,LL,,,LL,,,,,L,L,JT,TJ",
        "J,,,,,,L,T,,L,TL,LLL,LTJJJ,T,E",
        "JLLL,L,L,LLLL,LL,,,L,,,,T,T,TJ",
        "J,,,,L,L,L,,,,L,,L,LLL,JJT,T,J",
        "JJJJJJJJ*JJJJJJJJJJJJJJJJJJJJJ",
        "JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ"


],
    5:[
        "JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ",
        "JJ,,LL,,,,,,,6L,L,,,,LL,,,,YL,,L,,,L,,,,,,L,J",
        "JJ,,,L,TLLL,LLL,LLLL,LL,L,L,,,LLLL,LLLLLL,L,J",
        "JJ,L,LL,,L,,,,,,,,,L,L,,L,LLLLL,,,,,,,,,L,L,J",
        "JJ,LT,L,LLLLLLL,LLLL,L,LLLL,,,,,L,LLLLL,LT,,J",
        "JJLLTLL,L,,,,,L,,TT,,L,,,,,,LLL,L,,T,,L,,,L,J",
        "JJ,L,,L,LLLLL,LLLLLLLLL,L0L,L,L,LLLL,LLLLLLTJ",
        "JJ,T,,,,L,L,,,L,,LLL,YLLLLL,L,L,L,,L,L,LYL,,J",
        "JJ,LL,LLL,L,LLL,,,,,,,,,,,,,L,L,,,,LLL,L,L,LJ",
        "JJ,,L,,T,,,,LL,L,LLLLLLLL,LL,,,,LL,,,,,,,L,,J",
        "JJLLL,LLLLL,,L,L,,,L,,,L,,,,L,L,LLLLLLL,LLTLJ",
        "JJ,,L,,,T,LLLL,LLL,LTLLLLLLLL,L,L,,L,,L,,L,LJ",
        "JJ,LL,,LL,,,L,,L,L,,,,,,,,,,LL,,L,,,LT,L,,LLJ",
        "JJ,,,,,,L,LLL,LL,LLLLLLLLLL,,LL,T,L,,T,,LL,,J",
        "JJLLL,LLL,LL,,LL,T,,,,,LL,L,,L,,L,LLL,L,LL,LJ",
        "JJ7,L,L,,,T,,,,,LLLLLL,,,,L,,LL,L,,,L,L,T,,,J",
        "JJL,L,LTLLLLLL,,L,,,LLL,LLL,,L,,LLLLLLLLL,LLJ",
        "JJ,,L,LTL,,,,L,,L,L,L,,,,,,,LLL,L,L,L,L,,,,LJ",
        "JJ,LLLL,LL,,LL,TL,LLL,,L,LLLL,L,,,,T,,LLL,LLJ",
        "JJ,,,YL,,L,LL,,,L,T,LL,L,,LL,,L,LLLLL,,LL,,LJJJJJJJJJJJJJJJJJ",
        "JJL,LLL,LL,L,L,,,,,,L,,LLLL,,LL,L,,,L,,,,L,,JJ1JJ2JJ3JJ4JJ5JJ",
        "JJL,L,,,,,,L,LLLLLL,L,,L,,L,,LL,L,LLL,LLT,L,J,1,,2,,3,,4,,5,J",
        "JJ,,L,L,LLLL,,,,L,L,LL,L,LLL,,L,L,,,,,LL,,L,J,1,,2,,3,,4,,5,JJJJ",
        "JJL,,,LTL,,,,LL,L,L,,,,L,L,L,LL,LLLLLLLL,LLLJ,1,,2,,3,,4,,5,,EEJ",
        "JJLLLLL,L,,L,,L,L,,TLLLL,,,,T,,,,,,T,,,LL,,,,,1,,2,,3,,4,,5,,EEJ",
        "JJ,,,,L,LL,LLLLLLLLLLLLLLLLLLL,L,,LLLL,LL,L,J,1,,2,,3,,4,,5,JJJJ",
        "JJ,LT,L,,,T,,,,T,,,T,,LL,,,T,L,LL,L,,L,L,,L,J,1,,2,,3,,4,,5,J",
        "JJ,LL,LLLLLLLLLL,LLLL,LL,L,L,,,L,,L,,L,LL,L,JJ1JJ2JJ3JJ4JJ5JJ",
        "JJ,,LT,LL,,,,LTL,L,,L,L,,LLLLLLLLLLL,L,,,,L,JJJJJJJJJJJJJJJJJ",
        "JJ,,LL,L,,LLLL,,,LL,L,LLLLL,L,,,,,LL,LL,LLL,J",
        "JJL,LLLLL,,L,LLLTL,,L,,,,,,,LL,LL,,L,TL,,L,,J",
        "J*,,,,,,LL,,,L,L,L,LL,LLL,L,,,T,LL,L,,,,LLLLJ", // TU START W TTEJ LINI JAKO *
        "JJLLLLL,LL,L,L,,,,,L,,,L,,L,LLLLLLLLLL,,L,,LJ",
        "JJ,,,9L,,,TLLLLLLLLLLL,L,LL,L,,LLLL,,L,LL,,LJ",
        "JJL,LLL,LL,L,,,L,,,,,,,L,,,,LL,L,,,,,L,,,T,,J",
        "JJ,,,,,L,,L,L,L,LLLLLLLLLLLL,,,TLLL,LLL,LLLJ",
        "JJ,LLLL,L,,,,L,L,,,,,,,,,,,L,,LL,L,,,L,L,,,,J",
        "JJ,L,,,,L,LLLL,L,LLLL,LL,LL,,LLL,LLLLLTLLLL,J",
        "JJLL,LLL,T,L,,L,,L,,L,L,,LL,LL,L,,,,,L,,,,L,J",
        "JJ,L,LLL,LLLL,L,LL,,T,,L,,LYLL,LLLLL,L,LL,L,J",
        "JJ,,,L,,,,,,,,L,LLLLLLLLL,LLLL,L,T,,,L,,L,,,J",
        "JJTL,LLLLLLLL,L,,L,,,,,,,,,L,,,L,LLLLL,,LLLLJ",
        "JJ,L,,,,,,,,L,,L,LLLLL,L,L,,,LLL,,,,,LL,,,,,J",
        "JJ,LLL,LLLL,,L,L,,,,,LLLLLLLLL,LLLLL,LLLL,L,J",
        "JJ,LL,TL,,,L,LLL,LL,L,L,,,L,,,,L,,,,,L,LL,L,J",
        "JJ,,,L,LLL,L,,,,,L,,,,LLL,,LL,L,LL,L,L,,,TLTJ",
        "JJ,LL,,,,,,LLL,LLL,LL,,,L,,,,,,,,,,L,L,LLLL,J",
        "JJ,L,,LLL,LL,,,,WL,,L,L,,,L,LL,,L,LL,L,L8,,,J",
        "JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ"

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
