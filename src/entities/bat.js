//logika do przeciwnika: nietoperz
//może zacząć iść w prawo (>) lub w lewo (<).
//gdy dotrze do ściany, odbije kierunek.

export class Bat {
    constructor(x,y){ //way: < or >
        this.symbol = "<",
        this.x = x,
        this.y = y,
        this.cooldown = 0,
        this.isPanic = false,
        this.frame = 0,

        //Indywidualne
        this.direction = -1
    }


    update(map,now,MOVE_DELAY) {

        if (this.isPanic){
            map.clearRow(this.x,this.y);
            return;
        }
        if (now - this.cooldown > MOVE_DELAY) {

            if (map.getCell(this.x+this.direction,this.y) != "."){
                this.direction *= -1;
            }

            if (this.frame == 0){
                this.frame = 1;
            }else{
                this.frame = 0;
            }
            

            map.clearRow(this.x,this.y);
            map.setCell(this.x+this.direction,this.y,"<");
            
            this.x += this.direction;
            this.cooldown = now;
        }
    }

    panic(){//wyczyść wszystko i zatrzymaj
        this.isPanic = true;
    }
}