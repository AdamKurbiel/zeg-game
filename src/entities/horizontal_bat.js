//logika do przeciwnika: nietoperz (poziomy)
//porusza się lewo-prawo.
//gdy dotrze do ściany, odbije kierunek.

export class HorizontalBat {
    constructor(x,y){
        this.symbol = "<",
        this.x = x,
        this.y = y,
        this.cooldown = 0,
        this.isPanic = false,
        this.frame = 0,
        this.renderX = this.x,
        this.renderY = this.y

        //Indywidualne
        this.direction = -1
    }


    update(map,now,MOVE_DELAY) {
        var moveDelay = MOVE_DELAY * 1.50
        if (this.isPanic){
            map.clearRow(this.x,this.y);
            return;
        }
        if (now - this.cooldown > moveDelay) {

            if (map.getCell(this.x+this.direction,this.y) != "." && map.getCell(this.x+this.direction,this.y) != ";"){
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