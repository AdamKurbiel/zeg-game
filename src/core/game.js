import { buildMap, renderPlayer } from "../systems/renderer.js";
import { renderHud } from "../systems/hud.js";

export function createGame(ctx, statsCtx, gameCanvas, statsCanvas, map, player, camera, keys, entityHandler){ 
    const GAME_WIDTH = gameCanvas.width;
    const GAME_HEIGHT = gameCanvas.height;
    const STATS_WIDTH = statsCanvas.width;
    const STATS_HEIGHT = statsCanvas.height;
    
    //CONFIG (RACZEJ NIE ZMIENIAJ JEŚLI SIĘ NIE ZNASZ)
    const MOVE_DELAY = 150;
    const MOVE_EASING = 0.125;
    
    let running = true;
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



    function update(now){
        if (player.health == 0){
            player.paused = true;
            player.gameOver = true;
        }

        player.update(keys,map,now,MOVE_DELAY);
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

        ctx.restore();

        
        if (player.gameOver){
            ctx.globalAlpha = 0.5;
            gameCanvas.style.webkitFilter = "blur(3px)";
            ctx.fillStyle = "red";
            ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
            ctx.globalAlpha = 1.0;
        }else{
            gameCanvas.style.webkitFilter = "blur(0px)";
        }

        drawBorder();
    }



    function step(now){
        if (!running) return;

        update(now);

        renderHud(statsCtx,player,STATS_WIDTH,STATS_HEIGHT,map);
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