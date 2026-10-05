// @ts-check
/**
 * WAB. — Parallaxe douce du premier écran
 * Les objets autour du nom suivent la souris de quelques pixels,
 * chacun selon sa profondeur (--depth, desk-scatter.css). Le script
 * écrit directement le transform de chaque objet : changer une
 * variable sur le calque forcerait le recalcul de tous ses enfants.
 *
 * Le transform ne porte que la parallaxe : le glisser passe par
 * translate (drag.js), l'entrée par scale.
 *
 * Seulement à la souris, seulement quand le premier écran est
 * visible, jamais sous « réduire les animations ».
 */

/** Amplitude maximale, en pixels, pour une profondeur de 1. */
const RANGE = 12;
/** Part de l'écart rattrapée à chaque image : un suivi amorti. */
const FOLLOW = 0.08;
const SETTLED = 0.02;

/**
 * @typedef {object} Layer
 * @property {HTMLElement} el
 * @property {number} depth
 */

export function initParallax() {
    const root = document.querySelector('[data-scatter]');
    if (!(root instanceof HTMLElement)) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches) return;

    // Les objets du bureau, et le curseur posé au bout du nom.
    /** @type {Layer[]} */
    const layers = [];
    (root.closest('.hero') ?? root).querySelectorAll('.scat').forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        const depth = parseFloat(getComputedStyle(el).getPropertyValue('--depth')) || 1;
        layers.push({ el, depth });
    });

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let inView = true;
    let frame = 0;

    const paint = () => {
        for (const { el, depth } of layers) {
            el.style.transform = `translate3d(${(current.x * depth).toFixed(2)}px, ${(current.y * depth).toFixed(2)}px, 0)`;
        }
    };

    const step = () => {
        current.x += (target.x - current.x) * FOLLOW;
        current.y += (target.y - current.y) * FOLLOW;
        paint();
        const settled = Math.abs(target.x - current.x) < SETTLED && Math.abs(target.y - current.y) < SETTLED;
        frame = settled ? 0 : requestAnimationFrame(step);
    };

    const wake = () => {
        if (!frame) frame = requestAnimationFrame(step);
    };

    window.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse' || !inView || reduced.matches) return;
        target.x = (event.clientX / window.innerWidth - 0.5) * -2 * RANGE;
        target.y = (event.clientY / window.innerHeight - 0.5) * -2 * RANGE;
        wake();
    }, { passive: true });

    // Le pointeur quitte la fenêtre : le bureau revient au repos.
    document.documentElement.addEventListener('pointerleave', () => {
        target.x = 0;
        target.y = 0;
        wake();
    });

    reduced.addEventListener('change', () => {
        if (!reduced.matches) return;
        target.x = 0;
        target.y = 0;
        current.x = 0;
        current.y = 0;
        paint();
    });

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
        }).observe(root);
    }
}
