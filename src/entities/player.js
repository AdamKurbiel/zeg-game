import { restartLevel, nextLevel } from "../core/game.js";
import { activatePowder } from "../systems/vignette.js";

export function Player(){
    this.health = 2, //Życia gracza
    this.inventory = [],
    this.collectedNotes = [],

    this.immuneTimer = 5000; //czas efektu nietykalności
    

    //pozycja startowa gracza
    this.x = 1, 
    this.y = 1, 
    

    //gracz zatrzymany
    this.paused = false,
    this.gameOver = false,

    ///Zmienne sterowane przez pętlę gry///
    this.currentNote = 0; //aktualnie wyświetlana notatka (0 jeśli nie wyświetlana)
    this.currentMathChest = false,  //czy UI skrzynki jest aktywne
    this.mathChestPos = null, //pozycja skrzynki { x, y }
    this.animationState = "IDLE", //Stan animacji gracza
    this.foot = 0, //Klatka animacji gracza
    this.moveCooldown = 0; //Opóźnienie przy przytrzymaniu przycisku
    this.renderX = this.x, //płynne chodzenie
    this.renderY = this.y //płynne chodzenie
    this.immuneCooldown = 0; //cooldown do nietykalności
    this.immune = false; //efekt nietykalności przez burgera
    this.initialHealth = this.health; //zabezpieczenie aby hp po restarcie było ustawiane na takie jakie gracz miał na początku poziomu.
    this.crystalOrder = []; // kolejność zebranych kryształów
    
}
Player.prototype.resetPosition = function(map){
    var block = map.findFirstBlock("S") || map.findFirstBlock("*");//szukam startu
    if (block == false) return;

    this.x = block[1];
    this.y = block[0];
    this.renderX = this.x;
    this.renderY = this.y;
}

Player.prototype.update = function(KEYS, map, now, MOVE_DELAY,entityHandler,audioSystem) {
    if (this.paused) return;

    if (now - this.immuneCooldown > this.immuneTimer && this.immune){
        console.log("siema");
        this.immune = false;
        this.immuneCooldown = now;
    }

    if (now - this.moveCooldown > MOVE_DELAY) {
        let dx = 0;
        let dy = 0;

        if (KEYS.w) dy = -1;
        else if (KEYS.s) dy = 1;
        else if (KEYS.a) dx = -1;
        else if (KEYS.d) dx = 1;

        if (dx !== 0 || dy !== 0) {
            this.move(dx, dy, map,entityHandler,audioSystem);
            this.moveCooldown = now;
        }else{
            this.animationState = "IDLE";
        }
    }

    let currTile = map.content()[this.y][this.x];

    //tutaj kolizje z przeciwnikami nie zależące od ruchu gracza

    if (currTile == "<" || currTile == "^" || currTile == "P" || currTile == "V"){
        if (this.immune) return;
        audioSystem.playSfx("assets/sounds/sfx/bonk.mp3",0.25);
        restartLevel(this,entityHandler,map,true);     
    }

     if (currTile == "T") {

        for (let entity of entityHandler.entities) {

            if (entity.symbol == "T" &&

                entity.x == this.x && entity.y == this.y) {

                if (entity.isDangerous && !this.immune) {

                    audioSystem.playSfx("assets/sounds/sfx/bonk.mp3", 0.25);

                    restartLevel(this, entityHandler, map, true);

                }

                break;

            }

        }

    }
};

Player.prototype.deleteItem = function(item){
    let index = this.inventory.indexOf(item);
    this.inventory.splice(index, 1);
}

Player.prototype.move = function(dx,dy,map,entityHandler, audioSystem){
    if (this.paused) return;
    
    let nextTile = map.content()[this.y+dy][this.x+dx];
    if (nextTile == "#" || nextTile == "$" || nextTile == "P" || nextTile == "V" || nextTile == "J"
    || nextTile == "A" || nextTile == "F" || nextTile == "G" || nextTile == "H" || nextTile == "I") return; //sprawdzam czy to sciana

    if (nextTile == "D"){ //drzwi
        if (this.inventory.indexOf('KEY') != -1){
            this.deleteItem('KEY');
            map.clearRow(this.x+dx,this.y+dy);
        }else{
            return;
        }
    }

    if (nextTile == "X"){ // drzwi kryształowe
        const CORRECT_ORDER = ["Q","R","U"]; // niebieski → różowy → pomarańczowy
        const correct = 
            this.crystalOrder.length === 3 &&
            this.crystalOrder[0] === CORRECT_ORDER[0] &&
            this.crystalOrder[1] === CORRECT_ORDER[1] &&
            this.crystalOrder[2] === CORRECT_ORDER[2];

        if (correct){
            // dobra kolejność — otwieramy drzwi
            map.clearRow(this.x+dx, this.y+dy);
            this.inventory = this.inventory.filter(i => 
                i !== "CRYSTAL_BLUE" && i !== "CRYSTAL_PINK" && i !== "CRYSTAL_ORANGE"
            );
            this.crystalOrder = [];
            audioSystem.playSfx("assets/sounds/sfx/blip.mp3", 0.5);
            // gracz wchodzi na kafelek drzwi
        } else {
            // zła kolejność — kryształy wracają na mapę, gracz dostaje reset kolejności
            this.crystalOrder = [];
            // usuń kryształy z ekwipunku
            this.inventory = this.inventory.filter(i => 
                i !== "CRYSTAL_BLUE" && i !== "CRYSTAL_PINK" && i !== "CRYSTAL_ORANGE"
            );
            // przywróć kryształy na mapę (wróć do pozycji startowych)
            // Najprostsze rozwiązanie: przeładuj pozycje kryształów
            map.loadLevel(map.level); // reset mapy bez resetu gracza
            audioSystem.playSfx("assets/sounds/sfx/bonk.mp3", 0.25);
            return; // gracz NIE wchodzi
        }
    }

    if (nextTile == "N"){  //notatki
    this.currentNote = map.level;
    map.clearRow(this.x+dx, this.y+dy);
    if (!this.collectedNotes.includes(map.level)) {
        this.collectedNotes.push(map.level);
    }                                                  
}

     if (nextTile == "C"){ //skrzynka
        this.mathChestPos     = { x: this.x + dx, y: this.y + dy };
        this.currentMathChest = true;
        this.paused           = true;
        return; // gracz NIE wchodzi na kafelek skrzynki
    }

    this.x += dx;
    this.y += dy;

    this.foot = this.foot ? 0 : 1 ;
    this.animationState = `WALK${this.foot}`;//walk0 albo walk1

    if (nextTile == "M"){//leczenie (dodaje jeden punkt życia)
        audioSystem.playSfx("assets/sounds/sfx/heal.mp3",0.35);
        map.clearRow(this.x,this.y);
        this.health += 1;
    }

    if (nextTile == "B"){//Burger
        if (this.inventory.length >= 3) return;

        audioSystem.playSfx("assets/sounds/sfx/pickup_item.mp3",0.25);
        map.clearRow(this.x,this.y);
        this.inventory.push("BURGER");
    }

    if (nextTile == "K"){//Klucz
        if (this.inventory.length >= 3) return;

        audioSystem.playSfx("assets/sounds/sfx/pickup_item.mp3",0.25);
        map.clearRow(this.x,this.y);
        this.inventory.push("KEY");
    }

    if (nextTile == "Q"){ // kryształ niebieski
        if (this.inventory.length >= 3) return;
        audioSystem.playSfx("assets/sounds/sfx/pickup_item.mp3", 0.25);
        map.clearRow(this.x, this.y);
        this.inventory.push("CRYSTAL_BLUE");
        this.crystalOrder.push("Q");
    }

    if (nextTile == "R"){ // kryształ różowy
        if (this.inventory.length >= 3) return;
        audioSystem.playSfx("assets/sounds/sfx/pickup_item.mp3", 0.25);
        map.clearRow(this.x, this.y);
        this.inventory.push("CRYSTAL_PINK");
        this.crystalOrder.push("R");
    }

    if (nextTile == "U"){ // kryształ pomarańczowy
        if (this.inventory.length >= 3) return;
        audioSystem.playSfx("assets/sounds/sfx/pickup_item.mp3", 0.25);
        map.clearRow(this.x, this.y);
        this.inventory.push("CRYSTAL_ORANGE");
        this.crystalOrder.push("U");
    }


    if (nextTile == "Y"){ // Cukierek 
        if (this.inventory.length >= 3) return;

        audioSystem.playSfx("assets/sounds/sfx/pickup_item.mp3",0.25);
        map.clearRow(this.x,this.y);
        this.inventory.push("CANDY");
    }

        if (nextTile == "W"){ // Podejrzany proszek
            if (this.inventory.length >= 3) return;

            audioSystem.playSfx("assets/sounds/sfx/pickup_item.mp3", 0.25);
            map.clearRow(this.x, this.y);
            this.inventory.push("SUSSY_POWDER");
    }

    const LASER_TILES = ["1","2","3","4","5"];
    if (LASER_TILES.includes(nextTile)){
        if (!this.immune){
            audioSystem.playSfx("assets/sounds/sfx/bonk.mp3", 0.25);
            restartLevel(this, entityHandler, map, true);
            return;
        }
    }

    const BUTTON_LASER_MAP = {
        "6": "1",  // czerwony
        "7": "2",  // niebieski
        "8": "3",  // zielony
        "9": "4",  // fioletowy
        "0": "5"   // pomarańczowy
    };
    if (nextTile in BUTTON_LASER_MAP){
        const laserSymbol = BUTTON_LASER_MAP[nextTile];

        map.clearRow(this.x, this.y);

        for (let row = 0; row < map.content().length; row++){
            for (let col = 0; col < map.content()[row].length; col++){
                if (map.content()[row][col] === laserSymbol){
                    map.content()[row][col] = ".";
                }
            }
        }
        audioSystem.playSfx("assets/sounds/sfx/blip.mp3", 0.5);
    }

    if (nextTile == "E"){
        this.paused = true;
        //ładowanie kolejnego poziomu
        nextLevel(map,this,entityHandler);
    }

     if (nextTile == "T") {

        for (let entity of entityHandler.entities) {

            if (entity.symbol == "T" &&

                entity.x == (this.x+dx) && entity.y == (this.y+dy)) {

                if (entity.isDangerous && !this.immune) {

                    audioSystem.playSfx("assets/sounds/sfx/bonk.mp3", 0.25);

                    restartLevel(this, entityHandler, map, true);

                }

                break;

            }

        }

    }
    
}