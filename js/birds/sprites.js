/**
 * WAB. — Fabrique d'oiseaux
 * Chaque combinaison image × couleur × taille est peinte une seule
 * fois dans un calque hors écran, puis recopiée d'un bloc. Sans ce
 * cache, les oiseaux redessineraient environ 1500 petits carrés
 * chacun à chaque image : intenable maintenant qu'ils sont plusieurs
 * dizaines à traverser le fond en continu.
 *
 * Les tailles sont des multiples entiers du point de dessin : c'est
 * la condition pour que le pixel art reste net. Un oiseau lointain
 * est peint à 2 points par carré, un oiseau proche à 6.
 */

import { COLS, ROWS, FRAMES, FIXED_COLORS } from './frames.js';

export function createSpriteBank() {
    const cache = new Map();

    function spriteFor(frameIndex, bodyColor, scale) {
        const key = frameIndex + '|' + bodyColor + '|' + scale;
        const cached = cache.get(key);
        if (cached) return cached;

        const sprite = document.createElement('canvas');
        sprite.width = COLS * scale;
        sprite.height = ROWS * scale;

        const ctx = sprite.getContext('2d');
        if (!ctx) return sprite;

        const frame = FRAMES[frameIndex];
        for (let row = 0; row < ROWS; row++) {
            const line = frame[row];
            for (let col = 0; col < COLS; col++) {
                const point = line[col];
                if (point === '.' || point === undefined) continue;
                ctx.fillStyle = point === 'B' ? bodyColor : FIXED_COLORS[point];
                ctx.fillRect(col * scale, row * scale, scale, scale);
            }
        }

        cache.set(key, sprite);
        return sprite;
    }

    /**
     * Pose un oiseau, éventuellement retourné s'il vole vers la
     * gauche, et plus ou moins effacé selon son opacité.
     */
    function draw(ctx, bird, opacity) {
        if (opacity <= 0.01) return;

        const sprite = spriteFor(bird.frameIndex, bird.color, bird.scale);
        ctx.save();
        if (opacity < 1) ctx.globalAlpha = opacity;
        if (bird.dir === -1) {
            ctx.translate(Math.round(bird.x) + sprite.width, Math.round(bird.y));
            ctx.scale(-1, 1);
        } else {
            ctx.translate(Math.round(bird.x), Math.round(bird.y));
        }
        ctx.drawImage(sprite, 0, 0);
        ctx.restore();
    }

    return {
        draw,
        widthAt: (scale) => COLS * scale,
        heightAt: (scale) => ROWS * scale,
    };
}
