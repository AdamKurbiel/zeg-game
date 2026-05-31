// logika do przeciwnika: pająk (poziomy)
// porusza się lewo-prawo, tak samo jak HorizontalBat

export class Spider {
    constructor(x, y) {
        this.symbol = "P";
        this.x = x;
        this.y = y;
        this.cooldown = 0;
        this.isPanic = false;
        this.frame = 0;
        this.renderX = this.x;
        this.renderY = this.y;
        this.direction = 1;  // zaczyna w prawo
    }

    update(map, now, MOVE_DELAY) {
        var moveDelay = MOVE_DELAY * 2.0;

        if (this.isPanic) return;

        if (now - this.cooldown > moveDelay) {

            var nextCell = map.getCell(this.x + this.direction, this.y);

            // odbij jeśli ściana, brak komórki lub niechodliwy kafelek
            if (nextCell === undefined || (nextCell !== "." && nextCell !== ";")) {
                this.direction *= -1;
            }

            // sprawdź ponownie po odbiciu (zabezpieczenie przed zakleszczeniem)
            var nextCellAfterFlip = map.getCell(this.x + this.direction, this.y);
            if (nextCellAfterFlip === undefined || (nextCellAfterFlip !== "." && nextCellAfterFlip !== ";")) {
                // otoczony z obu stron — stój w miejscu
                this.cooldown = now;
                return;
            }

            // animacja — przełącz klatkę
            this.frame = this.frame === 0 ? 1 : 0;

            map.clearRow(this.x, this.y);
            map.setCell(this.x + this.direction, this.y, "P");

            this.x       += this.direction;
            this.cooldown = now;
        }
    }

    panic(map) {
        if (map) map.clearRow(this.x, this.y);
        this.isPanic = true;
    }
}