// logika do przeciwnika: pająk pionowy
// porusza się góra-dół.
// gdy idzie w górę: animacja spider-back-s1 / spider-back-s2
// gdy idzie w dół:  animacja spider-front-s1 / spider-front-s2
 
export class VerticalSpider {
    constructor(x, y) {
        this.symbol = "V";       // symbol na mapie
        this.x = x;
        this.y = y;
        this.cooldown = 0;
        this.isPanic = false;
        this.frame = 0;
        this.renderX = this.x;
        this.renderY = this.y;
 
        this.direction = -1;     // -1 = góra, 1 = dół
    }
 
    update(map, now, MOVE_DELAY) {
        var moveDelay = MOVE_DELAY * 2.0;
 
        if (this.isPanic) return;
 
        if (now - this.cooldown > moveDelay) {
 
            var nextCell = map.getCell(this.x, this.y + this.direction);
 
            // odbij jeśli ściana lub brak komórki
            if (nextCell === undefined || (nextCell !== "." && nextCell !== ";" && nextCell !== "Z" && nextCell !== "!")) {
                this.direction *= -1;
            }
 
            // zabezpieczenie przed zakleszczeniem
            var nextCellAfterFlip = map.getCell(this.x, this.y + this.direction);
            if (nextCellAfterFlip === undefined || (nextCellAfterFlip !== "." && nextCellAfterFlip !== ";" && nextCellAfterFlip !== "Z" && nextCellAfterFlip !== "!")) {
                this.cooldown = now;
                return;
            }
 
            // przełącz klatkę animacji
            this.frame = this.frame === 0 ? 1 : 0;
 
            map.clearRow(this.x, this.y);
            map.setCell(this.x, this.y + this.direction, "V");
 
            this.y += this.direction;
            this.cooldown = now;
        }
    }
 
    panic(map) {
        if (map) map.clearRow(this.x, this.y);
        this.isPanic = true;
    }
}
 