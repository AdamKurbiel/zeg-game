//logika do przeciwnika: nietoperz
//może zacząć iść w prawo (>) lub w lewo (<).
//gdy dotrze do ściany, odbije kierunek.
const DIRECTION = {
    '<' : -1
}

export class Bat {
    constructor(way,y,x){ //way: < or >
        this.defWay = way;
        this.x = x,
        this.y = y,
        this.way = DIRECTION[way],
        this.cooldown = 0
        this.isPanic = false
    }


    update(map,now,MOVE_DELAY) {
        if (this.isPanic){
            map.clearRow(this.x,this.y);
            return;
        }
        if (now - this.cooldown > MOVE_DELAY) {

            if (map.getCell(this.x+this.way,this.y) != "."){
                this.way *= -1
            }

            
            map.clearRow(this.x,this.y);
            map.setCell(this.x+this.way,this.y,this.defWay);
           
            this.x += this.way;
            
            this.cooldown = now;
        }
    }

    panic(){//wyczyść wszystko i zatrzymaj
        this.isPanic = true;
    }
}