/**
 * WAB. — Fabrique d'oiseaux
 * Chaque combinaison image × couleur est peinte une seule fois dans
 * un calque hors écran, puis recopiée d'un bloc. Sans ce cache, les
 * oiseaux redessineraient environ 1500 petits carrés à chaque image :
 * négligeable dans un coin de page, beaucoup trop lourd maintenant
 * qu'ils traversent le fond du site en continu.
 */

import { COLS, ROWS, FRAMES, FIXED_COLORS } from './frames.js';

export function createSpriteBank(initialScale) {
    let scale = initialScale;
    const cache = new Map();

    /** Repeint le cache à une nouvelle taille de point. */
    function setScale(next) {
        if (next === scale) return;
        scale = next;
        cache.clear();
    }

    function spriteFor(frameIndex, bodyColor) {
        const key = frameIndex + '|' + bodyColor;
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
    function draw(ctx, frameIndex, x, y, bodyColor, flipped, opacity = 1) {
        if (opacity <= 0.01) return;

        const sprite = spriteFor(frameIndex, bodyColor);
        ctx.save();
        if (opacity < 1) ctx.globalAlpha = opacity;
        if (flipped) {
            ctx.translate(Math.floor(x) + sprite.width, Math.floor(y));
            ctx.scale(-1, 1);
        } else {
            ctx.translate(Math.floor(x), Math.floor(y));
        }
        ctx.drawImage(sprite, 0, 0);
        ctx.restore();
    }

    return {
        setScale,
        draw,
        get width() { return COLS * scale; },
        get height() { return ROWS * scale; },
    };
}
