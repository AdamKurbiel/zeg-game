//logika do przeciwnika: nauczyciel
//może zacząć iść w prawo (>) lub w lewo (<).
//gdy dotrze do ściany, odbije kierunek.
const DIRECTION = {
    '>' : [1],
    '<' : [-1]
}

export class teacher {
    constructor(way,x,y){ //way: < or >
        this.x = x,
        this.y = y,
        this.way = DIRECTION[way],
        this.cooldown = 0
    }


    update(map,now,MOVE_DELAY) {
        if (now - this.moveCooldown > MOVE_DELAY) {
            console.log("Move!");
            this.moveCooldown = now;
        }
    }
}