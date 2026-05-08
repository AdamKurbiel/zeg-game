import { buildMap, renderEntities, renderPlayer } from "../systems/renderer.js";
import { renderHud } from "../systems/hud.js";

export function restartLevel(player,entityHandler,map,hasDied){

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


    function clearScreen(){
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

        ctx.fillStyle = "gray";
        ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    }

    function drawBorder(){
        ctx.lineWidth = 10;
        ctx.strokeStyle = "black";
        ctx.strokeRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    }

    function drawGameOver(ctx){
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "red";
        ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
        ctx.globalAlpha = 1.0;
        
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "bold 64px arial"
        ctx.fillText("KONIEC GRY",350,250);
        ctx.font = "28px arial"
        ctx.fillText(`Najdalej: Poziom ${map.level}`,350,290);

        ctx.font = "18px arial"
        ctx.fillText("Przegrano grę. Aby zacząć od początku, odśwież stronę.",350,650);
    }

    function update(now){
        if (player.health == 0){
            if (time_played == 0){
                time_played = now;
            } 
            player.paused = true;
            player.gameOver = true;
            
        }

        player.update(keys,map,now,MOVE_DELAY,entityHandler,audioSystem);
        camera.updatePosition(player,GAME_WIDTH,GAME_HEIGHT);
        entityHandler.update(map,now);
    }

    function render(){
        clearScreen();

        ctx.save();
        ctx.translate(-camera.renderX, -camera.renderY);

        buildMap(ctx,map);
        entityHandler.update();
        renderPlayer(ctx, player, MOVE_EASING);
        renderEntities(ctx,entityHandler);

        ctx.restore();

        
        if (player.gameOver){
            drawGameOver(ctx,player);
        }else{
            gameCanvas.style.webkitFilter = "blur(0px)";
        }

        drawBorder();
    }



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