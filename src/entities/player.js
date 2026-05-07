export function Player(){
    this.health = 3, //Życia gracza
    this.inventory = []

    //pozycja startowa gracza
    this.x = 1, 
    this.y = 1, 

    //gracz zatrzymany
    this.paused = false,
    this.gameOver = false,

    ///Zmienne sterowane przez pętlę gry///
    this.animationState = "IDLE", //Stan animacji gracza
    this.foot = 0, //Klatka animacji gracza
    this.moveCooldown = 0; //Opóźnienie przy przytrzymaniu przycisku
    this.renderX = this.x, //płynne chodzenie
    this.renderY = this.y //płynne chodzenie
    
}
Player.prototype.resetPosition = function(map){
    var block = map.findFirstBlock("S");//szukam startu
    if (block == false) return;

    this.x = block[1];
    this.y = block[0];
    this.renderX = this.x;
    this.renderY = this.y;
}

Player.prototype.update = function(KEYS, map, now, MOVE_DELAY) {
    if (this.paused) return;
    if (now - this.moveCooldown > MOVE_DELAY) {
        let dx = 0;
        let dy = 0;

        if (KEYS.w) dy = -1;
        else if (KEYS.s) dy = 1;
        else if (KEYS.a) dx = -1;
        else if (KEYS.d) dx = 1;

        if (dx !== 0 || dy !== 0) {
            this.move(dx, dy, map);
            this.moveCooldown = now;
        }else{
            this.animationState = "IDLE";
        }
    }

    let currTile = map.content()[this.y][this.x];

    //tutaj kolizje z przeciwnikami nie zależące od ruchu gracza

    if (currTile == "<"){
        this.health--;
        this.resetPosition(map);
    }
    
};


Player.prototype.move = function(dx,dy,map){
    if (this.paused) return;
    
    let nextTile = map.content()[this.y+dy][this.x+dx];
    if (nextTile == "#") return; //sprawdzam czy to sciana

    this.x += dx;
    this.y += dy;

    this.foot = this.foot ? 0 : 1 ;
    this.animationState = `WALK${this.foot}`;//walk0 albo walk1

    if (nextTile == "M"){//leczenie (dodaje jeden punkt życia)
        map.clearRow(this.x,this.y);
        this.health += 1;
    }

    if (nextTile == "B"){//Burger
        if (this.inventory.length >= 3) return;

        map.clearRow(this.x,this.y);
        this.inventory.push("BURGER");
    }

    if (nextTile == "E"){
        this.paused = true;
        //ładowanie kolejnego poziomu

        if (map.doMapExist(map.level+1)){
            map.loadLevel(map.level+1);
            this.resetPosition(map);
            this.paused = false;
        }
    }
    
}