// logika do przeciwnika: pająk (poziomy)
// porusza się lewo-prawo, tak samo jak HorizontalBat

export class Spider {
    constructor(x, y) {
        this.symbol  = "P",   // ✅ P = pająk na mapie
        this.x       = x,
        this.y       = y,
        this.cooldown = 0,
        this.isPanic  = false,
        this.frame    = 0,
        this.renderX  = this.x,
        this.renderY  = this.y,

        this.direction = 1    // zaczyna w prawo
    }

    update(map, now, MOVE_DELAY) {
        var moveDelay = MOVE_DELAY * 2.0  // trochę wolniejszy niż bat
        if (this.isPanic) {
            map.clearRow(this.x, this.y);
            return;
        }
        if (now - this.cooldown > moveDelay) {

            // odbij się od ściany lub niechodliwego kafelka
            if (map.getCell(this.x + this.direction, this.y) != "." &&
                map.getCell(this.x + this.direction, this.y) != ";") {
                this.direction *= -1;
            }

            // animacja — przełącz klatkę
            this.frame = this.frame === 0 ? 1 : 0;

            map.clearRow(this.x, this.y);
            map.setCell(this.x + this.direction, this.y, "P");

            this.x        += this.direction;
            this.cooldown  = now;
        }
    }

    panic() {
        this.isPanic = true;
    }
}