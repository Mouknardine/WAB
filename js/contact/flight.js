// @ts-check
/**
 * WAB. — L'envol du message
 * Quand le message part, un oiseau en pixel art traverse le haut de
 * la fenêtre et s'en va : le message est parti, et il est porté par
 * quelqu'un.
 *
 * Sous « réduire les animations », l'oiseau est simplement posé au
 * milieu, immobile.
 */

import { createSpriteBank } from '../birds/sprites.js?v=9';

const SCALE = 3;
const DURATION_MS = 1600;
const BEAT_MS = 110;

/** @type {ReturnType<typeof createSpriteBank> | null} */
let sprites = null;

/**
 * Courbe d'envol : l'oiseau part en bas à gauche, prend de la hauteur
 * et accélère en sortant par la droite.
 * @param {number} t avancement, de 0 à 1
 * @param {number} width
 * @param {number} height
 * @param {number} birdHeight
 */
function pathAt(t, width, height, birdHeight) {
    const eased = t * t * (3 - 2 * t) * 0.35 + t * t * 0.65;
    return {
        x: -40 + eased * (width + 80),
        y: height - birdHeight - Math.sin(t * Math.PI * 0.9) * (height - birdHeight) * 0.9,
    };
}

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {CanvasRenderingContext2D | null}
 */
function prepare(canvas) {
    // Une surface de dessin exactement à la taille affichée : étirée,
    // l'image rendrait les pixels de l'oiseau inégaux.
    canvas.width = Math.max(1, Math.round(canvas.clientWidth));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight));
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = false;
    sprites ??= createSpriteBank(SCALE);
    return ctx;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} frameIndex
 */
function drawBird(ctx, x, y, frameIndex) {
    sprites?.draw(ctx, x, y, frameIndex);
}

/**
 * Lance l'envol dans le canevas donné. Renvoie une fonction qui
 * l'interrompt (fenêtre refermée avant la fin).
 * @param {HTMLCanvasElement} canvas
 * @returns {() => void}
 */
export function playFlight(canvas) {
    const ctx = prepare(canvas);
    if (!ctx || !sprites) return () => {};

    const { width, height } = canvas;
    const birdWidth = sprites.width;
    const birdHeight = sprites.height;
    ctx.clearRect(0, 0, width, height);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        drawBird(ctx, (width - birdWidth) / 2, height - birdHeight, 0);
        return () => {};
    }

    let rafId = 0;
    const start = performance.now();

    /** @param {number} now */
    function frame(now) {
        // L'horodatage de la première image peut précéder `start` de
        // quelques microsecondes : on ne laisse jamais le temps écoulé
        // devenir négatif.
        const elapsed = Math.max(0, now - start);
        const t = Math.min(1, elapsed / DURATION_MS);
        const { x, y } = pathAt(t, width, height, birdHeight);
        ctx?.clearRect(0, 0, width, height);
        drawBird(ctx, x, y, Math.floor(elapsed / BEAT_MS) % 2);
        if (t < 1) rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
}
