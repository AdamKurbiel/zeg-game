export function renderHud(statsCtx,player,width,height){
    statsCtx.fillStyle = "#2B1A4F";
    statsCtx.fillRect(0,0,width,height);

    const HUD_POSITIONS = {
        heart : [10,10]
    }

    statsCtx.drawImage(
        TEXTURES.heart,
        HUD_POSITIONS.heart[0],
        HUD_POSITIONS.heart[1],
        64,
        64
    );

    statsCtx.fillStyle = "#cc3471";
    statsCtx.font = "48px arial";
    statsCtx.fillText(player.health,HUD_POSITIONS.heart[0]+80 ,HUD_POSITIONS.heart[1]+50);

    
}