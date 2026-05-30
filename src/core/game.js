import { buildMap, renderEntities, renderPlayer } from "../systems/renderer.js";
import { renderHud } from "../systems/hud.js";
import { FONTNAMES } from "./main.js";
import { notes } from "../world/maps.js";
import{ fog, updateFog, drawFog } from "../systems/vignette.js";
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
        }
}

export function createGame(ctx, statsCtx, gameCanvas, statsCanvas, map, player, camera, keys, entityHandler, audioSystem){ 
    //funkcja obsługująca cały system gry i zawierająca główną pętlę.
    const GAME_WIDTH = gameCanvas.width;
    const GAME_HEIGHT = gameCanvas.height;
    const STATS_WIDTH = statsCanvas.width;
    const STATS_HEIGHT = statsCanvas.height;
    
    //CONFIG (RACZEJ NIE ZMIENIAJ JEŚLI SIĘ NIE ZNASZ)
    const MOVE_DELAY = 150;
    const MOVE_EASING = 0.125;
    
    var time_played = 0;
    let running = true;

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
    function drawGameOver(){
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
        
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = `28px ${FONTNAMES[0]}`
        ctx.fillText(`${notes[player.currentNote]}`,350,290);

        ctx.font = `18px ${FONTNAMES[0]}`
        ctx.fillText("Kliknij na ekran aby zamknąć",350,640);
    }

    gameCanvas.addEventListener("click", (event) => {
        const rect = gameCanvas.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        checkGameClick();
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

        player.update(keys,map,now,MOVE_DELAY,entityHandler,audioSystem);
        camera.updatePosition(player,GAME_WIDTH,GAME_HEIGHT);
        entityHandler.update(map,now);

        updateFog(player);
    }

    function render(){
        //funkcja która odpowiada za wywoływanie renderowania mapy, gracza, bytów oraz całego ekranu gry z obramowaniem.
        clearScreen();

        ctx.save();
        ctx.translate(-camera.renderX, -camera.renderY);

        buildMap(ctx,map);
        entityHandler.update();
        renderPlayer(ctx, player, MOVE_EASING);
        renderEntities(ctx,entityHandler);

        ctx.restore();

        drawFog(ctx, camera, GAME_WIDTH, GAME_HEIGHT);
        
        if (player.gameOver){
            drawGameOver(player);
        }else if (player.currentNote != 0){
            drawNote(player);
        }

        drawBorder();
    }


    //Główna pętla gry
    function step(now){
        if (!running) return;

        update(now);

        renderHud(statsCtx,player,STATS_WIDTH,STATS_HEIGHT,map,now);
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
