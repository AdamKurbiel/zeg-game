//logika do przeciwnika: nauczyciel
//może zacząć iść w prawo (>) lub w lewo (<).
//gdy dotrze do ściany, odbije kierunek.
const DIRECTION = {
    '<' : -1
}

export class Teacher {
    constructor(way,y,x){ //way: < or >
        this.defWay = way;
        this.x = x,
        this.y = y,
        this.way = DIRECTION[way],
        this.cooldown = 0
    }


    update(map,now,MOVE_DELAY) {
        if (now - this.cooldown > MOVE_DELAY) {
            console.log("Move!");

            if (map.getCell(this.x+this.way,this.y) != "."){
                this.way *= -1
            }

            map.clearRow(this.x,this.y);
            this.x += this.way;
            map.setCell(this.x,this.y,this.defWay);
            
            
            this.cooldown = now;
        }
    }
}