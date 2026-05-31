import { TILE_SIZE } from "./renderer.js";

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

export const fog = {
    renderX: 0,
    renderY: 0
};

export function updateFog(player) {
    fog.renderX = lerp(fog.renderX, player.x, 0.05);
    fog.renderY = lerp(fog.renderY, player.y, 0.05);
}

export function drawFog(ctx, camera, canvasWidth, canvasHeight) {
    const playerCenterX = fog.renderX * TILE_SIZE - camera.renderX + TILE_SIZE / 2;
    const playerCenterY = fog.renderY * TILE_SIZE - camera.renderY + TILE_SIZE / 2;

    const fogRadius = TILE_SIZE * 6;

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