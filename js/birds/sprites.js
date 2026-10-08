// @ts-check
/**
 * WAB. — L'oiseau peint en pixel art
 * Chacune des deux images (ailes hautes, ailes basses) est peinte une
 * seule fois dans un calque hors écran, puis recopiée d'un bloc à
 * chaque image de l'envol, au lieu de redessiner ses centaines de
 * petits carrés.
 *
 * La taille est un multiple entier du point de dessin : c'est la
 * condition pour que le pixel art reste net.
 */

import { COLS, ROWS, FRAMES, BODY_COLOR, FIXED_COLORS } from './frames.js?v=12';

/**
 * @param {string[]} frame
 * @param {number} scale
 * @returns {HTMLCanvasElement}
 */
function paintFrame(frame, scale) {
    const sprite = document.createElement('canvas');
    sprite.width = COLS * scale;
    sprite.height = ROWS * scale;
    const ctx = sprite.getContext('2d');
    if (!ctx) return sprite;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const point = frame[row][col];
            if (point === '.' || point === undefined) continue;
            ctx.fillStyle = point === 'B' ? BODY_COLOR : FIXED_COLORS[point];
            ctx.fillRect(col * scale, row * scale, scale, scale);
        }
    }
    return sprite;
}

/** @param {number} scale  points d'écran par carré */
export function createSpriteBank(scale) {
    /** @type {Map<number, HTMLCanvasElement>} */
    const cache = new Map();

    /** @param {number} frameIndex */
    function spriteFor(frameIndex) {
        const cached = cache.get(frameIndex);
        if (cached) return cached;
        const sprite = paintFrame(FRAMES[frameIndex], scale);
        cache.set(frameIndex, sprite);
        return sprite;
    }

    /**
     * Pose l'oiseau, tourné vers la droite, le coin haut gauche en (x, y).
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x
     * @param {number} y
     * @param {number} frameIndex
     */
    function draw(ctx, x, y, frameIndex) {
        ctx.drawImage(spriteFor(frameIndex), Math.round(x), Math.round(y));
    }

    return { draw, width: COLS * scale, height: ROWS * scale };
}
