// @ts-check
/**
 * WAB OS — l'oiseau qui tient compagnie au curseur
 * Quand la souris ne bouge plus depuis un moment, un oiseau du site
 * arrive du bord de l'écran et se pose juste au-dessus du curseur.
 * Au moindre geste (souris, clavier, défilement), il repart.
 *
 * Un seul petit canevas, déplacé par transform ; dessiné avec la
 * fabrique d'oiseaux du site (mêmes images, même cache). Souris
 * seulement, onglet visible seulement, jamais sous « réduire les
 * animations » (shell.js ne le charge même pas).
 */

import { createSpriteBank } from '../birds/sprites.js?v=7';
import { BODY_COLORS } from '../birds/frames.js?v=8';

const IDLE_MS = 9000;
const ARRIVE_MS = 1300;
const LEAVE_MS = 700;
const BEAT_MS = 90;
const SCALE = 2;

const sprites = createSpriteBank();
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/** @typedef {'away' | 'arriving' | 'perched' | 'leaving'} BirdState */

export function initIdleBird() {
    const canvas = document.createElement('canvas');
    canvas.className = 'idle-bird';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.width = sprites.widthAt(SCALE);
    canvas.height = sprites.heightAt(SCALE);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    document.body.append(canvas);

    // Un oiseau posé : le bleu Klein (frames.js).
    const color = BODY_COLORS[0];
    const pointer = { x: -1, y: -1 };
    /** @type {BirdState} */
    let state = 'away';
    let timer = 0;
    let frame = 0;
    const at = { x: 0, y: 0 };

    /** @param {number} frameIndex @param {1 | -1} dir */
    const draw = (frameIndex, dir) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sprites.draw(ctx, { x: 0, y: 0, scale: SCALE, dir, frameIndex, color }, 1);
    };

    /** @param {number} x @param {number} y */
    const moveTo = (x, y) => {
        at.x = x;
        at.y = y;
        canvas.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    };

    /**
     * @param {{ x: number, y: number }} from
     * @param {{ x: number, y: number }} to
     * @param {number} duration
     * @param {1 | -1} dir
     * @param {() => void} done
     */
    const fly = (from, to, duration, dir, done) => {
        cancelAnimationFrame(frame);
        const start = performance.now();
        const tick = (/** @type {number} */ now) => {
            const t = Math.min(1, Math.max(0, now - start) / duration);
            const ease = 1 - (1 - t) ** 3;
            moveTo(from.x + (to.x - from.x) * ease, from.y + (to.y - from.y) * ease - Math.sin(t * Math.PI) * 40);
            draw(Math.floor((now - start) / BEAT_MS) % 2, dir);
            if (t < 1) frame = requestAnimationFrame(tick);
            else done();
        };
        frame = requestAnimationFrame(tick);
    };

    const arrive = () => {
        if (state !== 'away' || document.hidden || reduced.matches || pointer.x < 0) return;
        state = 'arriving';
        canvas.classList.add('is-shown');
        const target = { x: pointer.x - canvas.width * 0.35, y: pointer.y - canvas.height * 0.62 };
        const fromRight = pointer.x < window.innerWidth / 2;
        const start = { x: fromRight ? window.innerWidth + 20 : -canvas.width - 20, y: Math.max(0, target.y - 160) };
        fly(start, target, ARRIVE_MS, fromRight ? -1 : 1, () => {
            state = 'perched';
            draw(0, fromRight ? -1 : 1);
        });
    };

    const leave = () => {
        if (state === 'away' || state === 'leaving') return;
        state = 'leaving';
        fly({ ...at }, { x: at.x + 220, y: at.y - 260 }, LEAVE_MS, 1, () => {
            state = 'away';
            canvas.classList.remove('is-shown');
        });
    };

    const activity = () => {
        leave();
        window.clearTimeout(timer);
        timer = window.setTimeout(arrive, IDLE_MS);
    };

    window.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse') return;
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        activity();
    }, { passive: true });
    ['keydown', 'wheel', 'scroll', 'pointerdown'].forEach((type) => {
        window.addEventListener(type, activity, { passive: true });
    });
    document.documentElement.addEventListener('pointerleave', () => {
        pointer.x = -1;
        leave();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) leave(); });
    reduced.addEventListener('change', () => { if (reduced.matches) leave(); });
}
