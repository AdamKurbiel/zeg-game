import { restartLevel, nextLevel } from "../core/game.js";

export function Player(){
    this.health = 2, //Życia gracza
    this.inventory = [],

    this.immuneTimer = 5000; //czas efektu nietykalności
    

    //pozycja startowa gracza
    this.x = 1, 
    this.y = 1, 
    

    //gracz zatrzymany
    this.paused = false,
    this.gameOver = false,

    ///Zmienne sterowane przez pętlę gry///
    this.currentNote = 0; //aktualnie wyświetlana notatka (0 jeśli nie wyświetlana)
    this.animationState = "IDLE", //Stan animacji gracza
    this.foot = 0, //Klatka animacji gracza
    this.moveCooldown = 0; //Opóźnienie przy przytrzymaniu przycisku
    this.renderX = this.x, //płynne chodzenie
    this.renderY = this.y //płynne chodzenie
    this.immuneCooldown = 0; //cooldown do nietykalności
    this.immune = false; //efekt nietykalności przez burgera
    this.initialHealth = this.health; //zabezpieczenie aby hp po restarcie było ustawiane na takie jakie gracz miał na początku poziomu.
    
}
Player.prototype.resetPosition = function(map){
    var block = map.findFirstBlock("S");//szukam startu
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

    if (currTile == "<" || currTile == "^"){
        if (this.immune) return;
        audioSystem.playSfx("assets/sounds/sfx/bonk.mp3",0.25);
        restartLevel(this,entityHandler,map,true);     
    }
    
};

Player.prototype.deleteItem = function(item){
    let index = this.inventory.indexOf(item);
    this.inventory.splice(index, 1);
}

Player.prototype.move = function(dx,dy,map,entityHandler, audioSystem){
    if (this.paused) return;
    
    let nextTile = map.content()[this.y+dy][this.x+dx];
    if (nextTile == "#" || nextTile == "$") return; //sprawdzam czy to sciana

    if (nextTile == "D"){ //drzwi
        if (this.inventory.indexOf('KEY') != -1){
            this.deleteItem('KEY');
            map.clearRow(this.x+dx,this.y+dy);
        }else{
            return;
        }
    }

    if (nextTile == "N"){ //notatki
        this.currentNote = map.level;
        map.clearRow(this.x+dx,this.y+dy);
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



    if (nextTile == "E"){
        this.paused = true;
        //ładowanie kolejnego poziomu
        nextLevel(map,this,entityHandler);
    }
    
}