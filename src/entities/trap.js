// Pułapka z 3 fazami czasowymi

// Faza 0: spikes-s1 — BEZPIECZNA  — 3000ms

// Faza 1: spikes-s2 — NIEBEZPIECZNA — 1000ms

// Faza 2: spikes-s3 — NIEBEZPIECZNA — 2000ms


export class Trap {

    constructor(x, y) {

        this.symbol        = "T";

        this.x             = x;

        this.y             = y;

        this.renderX       = x;

        this.renderY       = y;

        this.phase         = 0;   // aktualna faza (0/1/2)

        this.frame         = 0;   // która tekstura jest wyświetlana

        this.isDangerous   = false; // czy zadaje obrażenia

        this.phaseStartTime = null;

        this.phaseDurations = [3000, 1000, 2000]; // mili sekundy

    }


    update(map, now, _moveDelay) {

        if (this.phaseStartTime === null)

            this.phaseStartTime = now;


        const elapsed = now - this.phaseStartTime;


        if (elapsed >= this.phaseDurations[this.phase]) {

            this.phase = (this.phase + 1) % 3;  // 0→1→2→0...

            this.phaseStartTime = now;

            this.frame         = this.phase;

            this.isDangerous   = (this.phase !== 0); // faza 0 = bezpieczna

        }

    }


    panic() { } // wymagane przez entityHandler.clear()

}