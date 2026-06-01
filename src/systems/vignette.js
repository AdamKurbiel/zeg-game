import { TILE_SIZE } from "./renderer.js";

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

export const fog = {
    renderX: 0,
    renderY: 0,
    currentRadius: 6, // aktualny promień (w kafelkach)
    targetRadius: 6, // docelowy promień
    powderTimer: 0, // czas do wygaśnięcia efektu
    POWDER_DURATION: 8000, // 8 sekund efektu
    NORMAL_RADIUS: 6,
    POWDER_RADIUS: 12
};

export function activatePowder(now) {
    fog.powderTimer = now + fog.POWDER_DURATION;
    fog.targetRadius = fog.POWDER_RADIUS;
}

export function updateFog(player, now) {
    fog.renderX = lerp(fog.renderX, player.x, 0.05);
    fog.renderY = lerp(fog.renderY, player.y, 0.05);

    // wygaszanie efektu proszku
    if (fog.powderTimer > 0 && now >= fog.powderTimer) {
        fog.powderTimer = 0;
        fog.targetRadius = fog.NORMAL_RADIUS;
    }

    fog.currentRadius = lerp(fog.currentRadius, fog.targetRadius, 0.04);
}

export function drawFog(ctx, camera, canvasWidth, canvasHeight) {
    const playerCenterX = fog.renderX * TILE_SIZE - camera.renderX + TILE_SIZE / 2;
    const playerCenterY = fog.renderY * TILE_SIZE - camera.renderY + TILE_SIZE / 2;

    const fogRadius = TILE_SIZE * fog.currentRadius;

    const gradient = ctx.createRadialGradient(
        playerCenterX, playerCenterY, 0,
        playerCenterX, playerCenterY, fogRadius
    );

    gradient.addColorStop(0,   "rgba(0, 0, 0, 0)");
    gradient.addColorStop(0.3, "rgba(0, 0, 0, 0.55)");
    gradient.addColorStop(1,   "rgba(0, 0, 0, 0.92)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}