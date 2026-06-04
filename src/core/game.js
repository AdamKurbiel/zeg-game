import { buildMap, renderGroundEntities, renderAirEntities, renderPlayer } from "../systems/renderer.js";
import { renderHud, renderNotes } from "../systems/hud.js";
import { FONTNAMES } from "./main.js";
import { notes } from "../world/maps.js";
import{ fog, updateFog, drawFog, activatePowder } from "../systems/vignette.js";
 
const MATH_CHEST_PUZZLE = {
    question : "2 + 2 × 3 = ?",
    answer   : 8
};
 
const NUMBER_CHEST_PUZZLE = {
    answer: 279
};
 
//Główny skrypt gry.
 
export function restartLevel(player,entityHandler,map,hasDied){
//Funkcja odpowiadająca za restart poziomu w przypadku śmierci, oraz w przypadku kliknięcia przycisku "zresetuj".
    if (hasDied){
        player.health--;
    }else{
        player.inventory = [];
        player.health = player.initialHealth;
        entityHandler.clear(map);
        map.loadLevel(map.level);
        map.instantiateEntities(entityHandler);
    }
    
    
    player.resetPosition(map)
    player.paused = false;
}
 
export function nextLevel(map,player,entityHandler){
    //Funkcja ładująca kolejny poziom.
        if (map.doMapExist(map.level+1)){
            player.initialHealth = player.health;
            entityHandler.clear(map);
            map.loadLevel(map.level+1);
            map.instantiateEntities(entityHandler);
            player.resetPosition(map);
            player.paused = false;
        }else{
            //mapa nie istnieje, zakladamy ze gracz skonczyl wszystkie poziomy
            player.won = true;
            player.gameOver = true;
        }
}
 
export function createGame(ctx, statsCtx, notesCtx, gameCanvas, statsCanvas, notesCanvas, map, player, camera, keys, entityHandler, audioSystem){
    //funkcja obsługująca cały system gry i zawierająca główną pętlę.
    const GAME_WIDTH = gameCanvas.width;
    const GAME_HEIGHT = gameCanvas.height;
    const STATS_WIDTH = statsCanvas.width;
    const STATS_HEIGHT = statsCanvas.height;
    const NOTES_WIDTH = notesCanvas.width;
    const NOTES_HEIGHT = notesCanvas.height;
 
    //CONFIG (RACZEJ NIE ZMIENIAJ JEŚLI SIĘ NIE ZNASZ)
    const MOVE_DELAY = 150;
    const MOVE_EASING = 0.125;
    
    var time_played = 0;
    let running = true;
 
    let mathChestActive  = false; 
 
    
    let mathChestAnswer  = "";
    let mathChestShake   = 0;
 
    let numberChestActive = false;
    let numberChestAnswer = "";
    let numberChestShake  = 0;
 
    const CHEST_INPUT_IMG = new Image();
    CHEST_INPUT_IMG.src = "assets/textures/chest-match-input.png";
 
    const CHEST_NUMBER_IMG = new Image();
    CHEST_NUMBER_IMG.src = "assets/textures/chest-number.png";
 
    function openMathChestUI(){
        if (mathChestActive) return;
            mathChestActive = true;
            mathChestAnswer = "";
            mathChestShake  = 0;
    }
 
    //zamknięcie UI, zmiana tekstury, nagroda medkit
    function closeMathChestUI(success){
        mathChestActive  = false;  
        mathChestAnswer  = "";
 
        if (success && player.mathChestPos){
            map.setCell(player.mathChestPos.x, player.mathChestPos.y, "O"); // C → O
            player.inventory.push("MEDKIT");                              // medkit do ekwipunku
            audioSystem.playSfx("assets/sounds/sfx/pickup_item.mp3", 0.25); // dzwięk
        }
 
        player.currentMathChest = false;
        player.mathChestPos     = null;
        player.paused           = false;
    }
 
    function openNumberChestUI(){
        if (numberChestActive) return;
        numberChestActive = true;
        numberChestAnswer = "";
        numberChestShake  = 0;
    }
 
    function closeNumberChestUI(success){
        numberChestActive = false;
        numberChestAnswer = "";
        if (success && player.numberChestPos){
            map.setCell(player.numberChestPos.x, player.numberChestPos.y, ")");
            player.inventory.push("MEDKIT");
            audioSystem.playSfx("assets/sounds/sfx/pickup_item.mp3", 0.25);
        }
        player.currentNumberChest = false;
        player.numberChestPos     = null;
        player.paused             = false;
    }
 
    function drawNumberChest(){
        ctx.globalAlpha = 0.6;
        ctx.fillStyle   = "black";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.globalAlpha = 1.0;
 
        const imgW = 300;
        const imgH = 300;
        const imgX = (GAME_WIDTH  - imgW) / 2;
        const imgY = (GAME_HEIGHT - imgH) / 2;
 
        const shakeX = numberChestShake > 0 ? Math.sin(numberChestShake * 1.8) * 8 : 0;
        if (numberChestShake > 0) numberChestShake--;
 
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(CHEST_NUMBER_IMG, imgX + shakeX, imgY, imgW, imgH);
 
                const slots = [
            numberChestAnswer[0] || "_",
            numberChestAnswer[1] || "_",
            numberChestAnswer[2] || "_",
        ];
        ctx.textAlign = "center";
        ctx.font      = `bold 48px tiny5`;
        ctx.fillStyle = "#ffd966";
        ctx.fillText(slots[0], imgX + shakeX + imgW * 0.22, imgY + imgH * 0.59);
        ctx.fillText(slots[1], imgX + shakeX + imgW * 0.50, imgY + imgH * 0.59);
        ctx.fillText(slots[2], imgX + shakeX + imgW * 0.78, imgY + imgH * 0.59);
 
        ctx.font      = `16px tiny5`;
        ctx.fillStyle = "#aaaaaa";
        ctx.fillText("ENTER = zatwierdz  ESC = zamknij", GAME_WIDTH / 2, imgY + imgH + 20);
    }
 
   function drawMathChest(){
    // przyciemnienie tła
    ctx.globalAlpha = 0.6;
    ctx.fillStyle   = "black";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.globalAlpha = 1.0;
 
    const imgW = 300;
    const imgH = 300;
    const imgX = (GAME_WIDTH  - imgW) / 2;   // wyśrodkowanie poziome
    const imgY = (GAME_HEIGHT - imgH) / 2;   // wyśrodkowanie pionowe
 
    // shake przy złej odpowiedzi
    const shakeX = mathChestShake > 0 ? Math.sin(mathChestShake * 1.8) * 8 : 0;
    if (mathChestShake > 0) mathChestShake--;
 
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(CHEST_INPUT_IMG, imgX + shakeX, imgY, imgW, imgH);
   
    const equationX = imgX + shakeX + (11 / 32 * imgW);
    const textY     = imgY + imgH * 0.55;  // środek pionowy obrazka
 
    ctx.textAlign   = "center";
    ctx.font        = `bold 40px tiny5`;
    ctx.fillStyle   = "#ffffff";
    ctx.shadowBlur  = 0;
    ctx.fillText("2 + 2 x 3 =", equationX, textY);
 
    const answerX    = imgX + shakeX + (26 / 32 * imgW);
    const displayVal = mathChestAnswer === "" ? "?" : mathChestAnswer;
 
    ctx.font        = `bold 40px tiny5`;
    ctx.fillStyle   = "#ffd966";
    ctx.fillText(displayVal, answerX, textY);
 
    ctx.shadowBlur  = 0;
    ctx.font        = `16px tiny5`;
    ctx.fillStyle   = "#aaaaaa";
    ctx.fillText("ENTER = zatwierdz  ESC = zamknij", GAME_WIDTH / 2, imgY + imgH + 20);
}
 
    //
    audioSystem.playMusic("assets/sounds/music/01.mp3",0.5);
    //
 
    //czyszczenie ekranu
    function clearScreen(){
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
 
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    }
 
    //rysowanie obramowania
    function drawBorder(){
        ctx.lineWidth = 10;
        ctx.strokeStyle = "black";
        ctx.strokeRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    }
 
    function checkGameClick(){
        if (player.currentNote != 0){
            console.log("SIGMA");
            player.currentNote = 0;
            player.paused = false;
        } 
    }
    //rysowanie ekranu końca gry
    function drawGameOver(won = false){
        if (won){
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "purple";
            ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
            ctx.globalAlpha = 1.0;

            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font = `108px ${FONTNAMES[1]}`;
            ctx.fillText("KONIEC", 350,250);
            ctx.font = `28px ${FONTNAMES[0]}`;
            ctx.fillText("Ciąg dalszy nastąpi..", 350,290);      

            ctx.font = `18px ${FONTNAMES[0]}`
            ctx.fillText("Wykonano przez Adam Kurbiel i Karina Bednarska. (2026)",350,640);

            return;
        }

        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "red";
        ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
        ctx.globalAlpha = 1.0;
        
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = `108px ${FONTNAMES[1]}`
        ctx.fillText("KONIEC GRY",350,250);
        ctx.font = `28px ${FONTNAMES[0]}`
        ctx.fillText(`Najdalej: Poziom ${map.level}`,350,290);
 
        ctx.font = `18px ${FONTNAMES[0]}`
        ctx.fillText("Przegrano grę. Aby zacząć od początku, odśwież stronę.",350,640);
    }
 
    function drawNote(player){
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
        ctx.globalAlpha = 1.0;
 
        const BOX_W = 500;
        const LINE_H = 26;
        const PADDING = 20;
 
        // ustaw czcionkę PRZED measureText żeby pomiar był dokładny
        ctx.font = `20px ${FONTNAMES[1]}`;
 
        // najpierw oblicz wszystkie linie
        const rawLines = (notes[player.currentNote] || "").split("\n");
        const MAX_WIDTH = BOX_W - 40;
        let allLines = [];
 
        for (let raw of rawLines) {
            let words = raw.split(" ");
            let line = "";
            for (let word of words) {
                let test = line ? line + " " + word : word;
                if (ctx.measureText(test).width > MAX_WIDTH && line !== "") {
                    allLines.push(line);
                    line = word;
                } else {
                    line = test;
                }
            }
            allLines.push(line);
        }
 
        // dopasuj wysokość do ilości linii
        const BOX_H = 70 + allLines.length * LINE_H + PADDING;
        const BOX_X = (GAME_WIDTH - BOX_W) / 2;
        const BOX_Y = Math.max(20, (GAME_HEIGHT - BOX_H) / 2); // wyśrodkuj, min 20px od góry
 
        // tło ramki
        ctx.fillStyle = "#1a0d33";
        ctx.strokeStyle = "#d4aaff";
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.92;
        ctx.fillRect(BOX_X, BOX_Y, BOX_W, BOX_H);
        ctx.globalAlpha = 1.0;
        ctx.strokeRect(BOX_X, BOX_Y, BOX_W, BOX_H);
 
        // tytuł
        ctx.fillStyle = "#d4aaff";
        ctx.textAlign = "center";
        ctx.font = `28px ${FONTNAMES[0]}`;
        ctx.fillText(`Notatka #${player.currentNote}`, GAME_WIDTH / 2, BOX_Y + 35);
 
        // linia pod tytułem
        ctx.strokeStyle = "#7a4bbf";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(BOX_X + 15, BOX_Y + 48);
        ctx.lineTo(BOX_X + BOX_W - 15, BOX_Y + 48);
        ctx.stroke();
 
        // tekst
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.font = `20px ${FONTNAMES[1]}`;
        let textStartY = BOX_Y + 70;
        for (let i = 0; i < allLines.length; i++) {
            ctx.fillText(allLines[i], BOX_X + 20, textStartY + i * LINE_H);
        }
 
        // hint na dole
        ctx.fillStyle = "#aaaaaa";
        ctx.font = `16px ${FONTNAMES[0]}`;
        ctx.textAlign = "center";
        ctx.fillText("Kliknij na ekran aby zamknąć", GAME_WIDTH / 2, BOX_Y + BOX_H - 8);
    }
    gameCanvas.addEventListener("click", (event) => {
        const rect = gameCanvas.getBoundingClientRect();
 
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
 
        checkGameClick();
    });
 
    window.addEventListener("keydown", (e) => {
    if (mathChestActive){
        if (e.key >= "0" && e.key <= "9"){
            if (mathChestAnswer.length < 4) mathChestAnswer += e.key;
        } else if (e.key === "Backspace"){
            mathChestAnswer = mathChestAnswer.slice(0, -1);
        } else if (e.key === "Enter"){
            const val = parseInt(mathChestAnswer);
            if (val === MATH_CHEST_PUZZLE.answer){
                closeMathChestUI(true);
            } else {
                mathChestAnswer = "";
                mathChestShake  = 12;
            }
        } else if (e.key === "Escape"){
            closeMathChestUI(false);
        }
        return;
    }
 
    if (numberChestActive){
        if (e.key >= "0" && e.key <= "9"){
            if (numberChestAnswer.length < 3) numberChestAnswer += e.key;
        } else if (e.key === "Backspace"){
            numberChestAnswer = numberChestAnswer.slice(0, -1);
        } else if (e.key === "Enter"){
            const val = parseInt(numberChestAnswer);
            if (val === NUMBER_CHEST_PUZZLE.answer){
                closeNumberChestUI(true);
            } else {
                numberChestAnswer = "";
                numberChestShake  = 12;
            }
        } else if (e.key === "Escape"){
            closeNumberChestUI(false);
        }
        return;
    }
});
 
    //funkcja aktualizująca stan gracza, kamery oraz bytów.
    function update(now){
        if (player.health == 0){
            if (time_played == 0){
                time_played = now;
            } 
            player.paused = true;
            player.gameOver = true;
            
        }
 
        if (player.currentNote != 0){
            player.paused = true;
        }
 
        //uruchom UI gdy gracz podejdzie do skrzynki
        if (player.currentMathChest && !document.getElementById("math-chest-ui")){
            openMathChestUI();
        }
 
        if (player.currentNumberChest){
            if (!numberChestActive) openNumberChestUI();
        }
 
        player.update(keys,map,now,MOVE_DELAY,entityHandler,audioSystem);
        camera.updatePosition(player,GAME_WIDTH,GAME_HEIGHT);
        entityHandler.update(map,now);
 
        updateFog(player, now);
    }
 
    function render(){
        //funkcja która odpowiada za wywoływanie renderowania mapy, gracza, bytów oraz całego ekranu gry z obramowaniem.
        clearScreen();
 
        ctx.save();
        ctx.translate(-camera.renderX, -camera.renderY);
 
        buildMap(ctx,map, map);
        renderGroundEntities(ctx, entityHandler, map);   // 2. pułapki POD graczem
        renderPlayer(ctx, player, MOVE_EASING, map);     // 3. gracz
        renderAirEntities(ctx, entityHandler, map);      // 4. nietoperze NAD graczem
        ctx.restore();
 
        drawFog(ctx, camera, GAME_WIDTH, GAME_HEIGHT);
        
        if (player.gameOver){
            drawGameOver(player.won);
        }else if (player.currentNote != 0){
            drawNote(player);
        }
 
        if (mathChestActive){
            drawMathChest();
        }
 
        if (numberChestActive){
            drawNumberChest();
        }
 
        drawBorder();
    }
 
 
    //Główna pętla gry
    function step(now){
        if (!running) return;
 
        update(now);
 
        renderHud(statsCtx,player,STATS_WIDTH,STATS_HEIGHT,map,now);
        renderNotes(notesCtx, NOTES_WIDTH, NOTES_HEIGHT, player); 
        render();
 
        requestAnimationFrame(step);
    }
 
 
    return {
        start(){
            running = true;
            camera.updateRaw(player,GAME_WIDTH,GAME_HEIGHT);
            
 
            requestAnimationFrame(step);
        },
        stop(){
            running = false;
        }
    };
}