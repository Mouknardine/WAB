// @ts-check
/**
 * WAB. — Le premier écran qui se creuse de pixels bleus
 * Branche la traînée (pixels-field.js) et les motifs des bords
 * (pixels-patterns.js) sur le canevas du premier écran [data-pixels] :
 * la souris, le doigt (sans empêcher le défilement), le clic sur un
 * motif,
 * et un passage fantôme qui montre que l'écran réagit — une fois à
 * l'arrivée, puis de temps en temps sur un écran tactile, où aucune
 * souris ne survole.
 *
 * L'animation ne tourne que lorsqu'il y a quelque chose à peindre.
 * Avec « mouvement réduit », pas de passage fantôme ni de brouillage :
 * l'écran ne répond qu'à la main du visiteur.
 */

import { keepRects, pickTint } from './pixels-ink.js?v=3';
import { createField } from './pixels-field.js?v=4';
import { createPatterns } from './pixels-patterns.js?v=4';

const GHOST_MS = 2400;
const GHOST_FIRST_DELAY_MS = 700;
const GHOST_EVERY_MS = 7000;
/** Après un geste réel, le fantôme se tait au moins ce temps-là. */
const GHOST_QUIET_MS = 5000;
/** Au-delà de ce délai, deux positions ne sont plus reliées. */
const JOIN_MS = 140;
const KEEP_MARGIN = 10;
/** La traînée change de teinte au bout de ce temps de mouvement. */
const TINT_EVERY_MS = 900;
/** Espace laissé libre sous la barre de menus, en plus de sa hauteur. */
const BAR_GAP = 12;

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
    let patterns = createPatterns(sizeFor());
    let width = 0;
    let tint = pickTint();
    let tintSince = 0;
    let height = 0;
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

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = hero.clientWidth;
        height = hero.clientHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const keep = keepRects(hero, canvas, KEEP_MARGIN);
        const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar-h')) || 44;
        field = createField(sizeFor());
        field.resize(width, height, keep);
        patterns = createPatterns(sizeFor());
        patterns.generate(width, height, keep, bar + BAR_GAP, performance.now());
        wake();
    }

    /** Relie la position à la précédente : pas de trou si le geste est vif. */
    function point(x, y, now) {
        if (now - tintSince > TINT_EVERY_MS) {
            tint = pickTint(tint);
            tintSince = now;
        }
        const step = sizeFor().block / 2;
        if (last && now - last.t < JOIN_MS) {
            const dist = Math.hypot(x - last.x, y - last.y);
            const steps = Math.min(40, Math.ceil(dist / step));
            for (let i = 1; i <= steps; i += 1) {
                field.stamp(last.x + ((x - last.x) * i) / steps, last.y + ((y - last.y) * i) / steps, now, tint);
            }
        } else {
            field.stamp(x, y, now, tint);
        }
        last = { x, y, t: now };
        wake();
    }

    /** @param {number} clientX @param {number} clientY */
    function human(clientX, clientY) {
        const origin = canvas.getBoundingClientRect();
        const x = clientX - origin.left;
        const y = clientY - origin.top;
        lastHuman = performance.now();
        ghostStart = null;
        const over = patterns.find(x, y);
        hero.classList.toggle('is-over-pattern', over !== null);
        if (over) patterns.mutate(over, lastHuman);
        point(x, y, lastHuman);
    }

    /** Un clic (ou un toucher) sur un motif le redessine en entier. */
    function press(/** @type {MouseEvent} */ event) {
        if (event.target instanceof Element && event.target.closest('a, button')) return;
        const origin = canvas.getBoundingClientRect();
        const over = patterns.find(event.clientX - origin.left, event.clientY - origin.top);
        if (!over) return;
        patterns.regenerate(over, performance.now());
        wake();
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
        const still = reducedMotion.matches;
        ctx.clearRect(0, 0, width, height);
        patterns.draw(ctx, now, still);
        field.draw(ctx, now, still);
        if (busy || patterns.moving(now) || ghostStart !== null) wake();
    }

    function wake() {
        if (!frame) frame = window.requestAnimationFrame(tick);
    }

    hero.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'touch') human(event.clientX, event.clientY);
    });
    hero.addEventListener('pointerleave', () => {
        last = null;
        hero.classList.remove('is-over-pattern');
    });
    hero.addEventListener('click', press);
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
