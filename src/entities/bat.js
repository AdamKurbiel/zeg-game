//logika do przeciwnika: nietoperz
//może zacząć iść w prawo (>) lub w lewo (<).
//gdy dotrze do ściany, odbije kierunek.

export class Bat {
    constructor(x,y){ //way: < or >
        this.x = x,
        this.y = y,
        this.direction = -1,
        this.cooldown = 0,
        this.isPanic = false
        this.frame = "<";
    }


    update(map,now,MOVE_DELAY) {

        console.log(`existing BAT ON X: ${this.x},Y:${this.y}`)

        if (this.isPanic){
            map.clearRow(this.x,this.y);
            return;
        }
        if (now - this.cooldown > MOVE_DELAY) {

            if (map.getCell(this.x+this.direction,this.y) != "."){
                this.direction *= -1;
            }

            if (this.frame == "<"){
                this.frame = ">";
            }else{
                this.frame = "<";
            }
            

            map.clearRow(this.x,this.y);
            map.setCell(this.x+this.direction,this.y,this.frame);
            console.log(this.x);
            
            this.x += this.direction;
            this.cooldown = now;
        }
    }

    panic(){//wyczyść wszystko i zatrzymaj
        this.isPanic = true;
    }
}