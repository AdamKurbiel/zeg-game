//Chcąc nie chcąc to duży skrypt :( mam nadzieje że czytelny
import { buildMap, renderPlayer, TILE_SIZE } from "./renderer.js";

export function createGame(ctx, statsCtx, gameCanvas, statsCanvas, map, player, camera, keys){ 
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

    function clearStats(){
        statsCtx.fillStyle = "#2B1A4F";
        statsCtx.fillRect(0,0,STATS_WIDTH,STATS_HEIGHT);
    }

    function drawBorder(){
        ctx.lineWidth = 10;
        ctx.strokeStyle = "black";
        ctx.strokeRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    }

    function update(now){
        player.update(keys,map,now,MOVE_DELAY);
        camera.updatePosition(player,GAME_WIDTH,GAME_HEIGHT);
    }

    function render(){
        clearScreen();

        ctx.save();
        ctx.translate(-camera.renderX, -camera.renderY);

        buildMap(ctx,map);
        renderPlayer(ctx, player, MOVE_EASING);

        ctx.restore();

        drawBorder();
    }

    function step(now){
        if (!running) return;

        clearStats();
        update(now);
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