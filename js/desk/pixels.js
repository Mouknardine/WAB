// @ts-check
/**
 * WAB. — Le premier écran qui se creuse de pixels bleus
 * Branche la grille (pixels-field.js) sur le canevas du premier écran
 * [data-pixels] : la souris, le doigt (sans empêcher le défilement),
 * et un passage fantôme qui montre que l'écran réagit — une fois à
 * l'arrivée, puis de temps en temps sur un écran tactile, où aucune
 * souris ne survole.
 *
 * L'animation ne tourne que lorsqu'il y a quelque chose à peindre.
 * Avec « mouvement réduit », pas de passage fantôme ni de brouillage :
 * l'écran ne répond qu'à la main du visiteur.
 */

import { createField } from './pixels-field.js?v=1';

const GHOST_MS = 2400;
const GHOST_FIRST_DELAY_MS = 700;
const GHOST_EVERY_MS = 7000;
/** Après un geste réel, le fantôme se tait au moins ce temps-là. */
const GHOST_QUIET_MS = 5000;
/** Au-delà de ce délai, deux positions ne sont plus reliées. */
const JOIN_MS = 140;
const KEEP_MARGIN = 10;

export function initPixels() {
    const hero = document.querySelector('[data-pixels]');
    const canvas = hero?.querySelector('[data-pixels-canvas]');
    if (!(hero instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement)) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const wide = window.matchMedia('(min-width: 900px)');
    const touchOnly = window.matchMedia('(hover: none)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let field = createField(sizeFor());
    /** @type {{ x: number, y: number, t: number } | null} */
    let last = null;
    let frame = 0;
    let lastHuman = -Infinity;
    let inView = true;
    /** @type {number | null} */
    let ghostStart = null;
    /** @type {number | undefined} */
    let ghostTimer;

    function sizeFor() {
        return wide.matches ? { block: 60, glyph: 20 } : { block: 48, glyph: 16 };
    }

    function keepRects() {
        const origin = canvas.getBoundingClientRect();
        return Array.from(hero.querySelectorAll('[data-pixels-keep]')).map((el) => {
            const r = el.getBoundingClientRect();
            return { x: r.left - origin.left - KEEP_MARGIN, y: r.top - origin.top - KEEP_MARGIN, w: r.width + KEEP_MARGIN * 2, h: r.height + KEEP_MARGIN * 2 };
        });
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = hero.clientWidth;
        const h = hero.clientHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        field = createField(sizeFor());
        field.resize(w, h, keepRects());
        ctx.clearRect(0, 0, w, h);
    }

    /** Relie la position à la précédente : pas de trou si le geste est vif. */
    function point(x, y, now) {
        const step = sizeFor().block / 2;
        if (last && now - last.t < JOIN_MS) {
            const dist = Math.hypot(x - last.x, y - last.y);
            const steps = Math.min(40, Math.ceil(dist / step));
            for (let i = 1; i <= steps; i += 1) {
                field.stamp(last.x + ((x - last.x) * i) / steps, last.y + ((y - last.y) * i) / steps, now);
            }
        } else {
            field.stamp(x, y, now);
        }
        last = { x, y, t: now };
        wake();
    }

    /** @param {number} clientX @param {number} clientY */
    function human(clientX, clientY) {
        const origin = canvas.getBoundingClientRect();
        lastHuman = performance.now();
        ghostStart = null;
        point(clientX - origin.left, clientY - origin.top, lastHuman);
    }

    /** Le passage fantôme : une boucle lente dans le haut de l'écran. */
    function ghostAt(now) {
        if (ghostStart === null) return;
        const t = (now - ghostStart) / GHOST_MS;
        if (t >= 1) {
            ghostStart = null;
            last = null;
            scheduleGhost(GHOST_EVERY_MS);
            return;
        }
        const w = hero.clientWidth;
        const h = hero.clientHeight;
        const a = t * Math.PI * 2;
        point(w * (0.5 + 0.4 * Math.sin(a * 1.1 - 1.4)), h * (0.36 + 0.2 * Math.sin(a * 2.2)), now);
    }

    function scheduleGhost(delay) {
        window.clearTimeout(ghostTimer);
        if (reducedMotion.matches) return;
        ghostTimer = window.setTimeout(() => {
            const quiet = performance.now() - lastHuman > GHOST_QUIET_MS;
            const firstVisit = lastHuman === -Infinity;
            if (inView && !document.hidden && quiet && (firstVisit || touchOnly.matches)) {
                last = null;
                ghostStart = performance.now();
                wake();
            } else if (touchOnly.matches) {
                scheduleGhost(GHOST_EVERY_MS);
            }
        }, delay);
    }

    function tick(now) {
        frame = 0;
        ghostAt(now);
        const busy = field.prune(now);
        field.draw(ctx, now, reducedMotion.matches);
        if (busy || ghostStart !== null) wake();
    }

    function wake() {
        if (!frame) frame = window.requestAnimationFrame(tick);
    }

    hero.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'touch') human(event.clientX, event.clientY);
    });
    hero.addEventListener('pointerleave', () => { last = null; });
    const onTouch = (/** @type {TouchEvent} */ event) => {
        const touch = event.touches[0];
        if (touch) human(touch.clientX, touch.clientY);
    };
    hero.addEventListener('touchstart', onTouch, { passive: true });
    hero.addEventListener('touchmove', onTouch, { passive: true });

    new ResizeObserver(resize).observe(hero);
    if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
            inView = entries.some((entry) => entry.isIntersecting);
        }).observe(hero);
    }

    resize();
    // Les signes se peignent en Sligoil : on attend la police, sans bloquer.
    document.fonts?.load('16px Sligoil').catch(() => undefined);
    // Le nom change de largeur une fois sa police chargée : on remesure.
    document.fonts?.ready.then(resize).catch(() => undefined);
    scheduleGhost(GHOST_FIRST_DELAY_MS);
}
