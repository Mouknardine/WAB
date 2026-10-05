// @ts-check
/**
 * WAB OS — les objets qu'on déplace
 * Sur ordinateur, chaque objet marqué [data-drag] se prend à la
 * souris et se repose ailleurs, comme sur un vrai bureau. Un simple
 * clic suit le lien de l'objet ; après un glisser, le clic qui le
 * termine est avalé (data-dragged), il n'ouvre rien.
 *
 * Le déplacement passe par la propriété `translate` : il se compose
 * avec la parallaxe (transform) et l'entrée (scale) sans jamais
 * les écraser.
 *
 * Au doigt, rien : un glisser bloquerait le défilement de la page, et
 * un appui suit le lien. Sous « réduire les animations », rien non
 * plus : tout reste à sa place. Ces objets sont un décor, la page ne
 * dépend jamais d'eux.
 */

/** Ce qui doit rester visible d'un objet poussé hors du bureau. */
const KEEP_VISIBLE = 48;
/** En deçà, c'est un clic, pas un glisser. */
const DRAG_THRESHOLD = 4;

/**
 * @typedef {object} Offset
 * @property {number} x
 * @property {number} y
 */

/** @type {WeakMap<HTMLElement, Offset>} */
const offsets = new WeakMap();
let topLayer = 10;
/** Un seul objet à la fois : un second doigt ou clic est ignoré. */
let dragging = false;

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initDrag() {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return;

    const items = document.querySelectorAll('[data-drag]');
    items.forEach((item) => {
        if (item instanceof HTMLElement) makeDraggable(item);
    });

    // Le clic qui termine un glisser : avalé avant tout autre écouteur
    // (lien, recherche ⌘K de la loupe).
    window.addEventListener('click', (event) => {
        const item = event.target instanceof Element ? event.target.closest('[data-drag]') : null;
        if (!(item instanceof HTMLElement) || !item.dataset.dragged) return;
        delete item.dataset.dragged;
        event.preventDefault();
        event.stopPropagation();
    }, true);
}

/** @param {HTMLElement} item */
function makeDraggable(item) {
    item.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 || dragging || reduced.matches) return;
        event.preventDefault();
        startDrag(item, event);
    });
}

/**
 * @param {HTMLElement} item
 * @param {PointerEvent} down
 */
function startDrag(item, down) {
    const bounds = item.offsetParent instanceof HTMLElement
        ? item.offsetParent.getBoundingClientRect()
        : document.documentElement.getBoundingClientRect();
    const start = offsets.get(item) || { x: 0, y: 0 };
    const rect = item.getBoundingClientRect();

    // Les limites du déplacement : l'objet peut sortir en partie du
    // bureau, jamais en entier.
    const limits = {
        minX: start.x + (bounds.left - rect.right) + KEEP_VISIBLE,
        maxX: start.x + (bounds.right - rect.left) - KEEP_VISIBLE,
        minY: start.y + (bounds.top - rect.top),
        maxY: start.y + (bounds.bottom - rect.top) - KEEP_VISIBLE,
    };

    dragging = true;
    // Un glisser précédent dont le clic final n'est jamais venu.
    delete item.dataset.dragged;
    topLayer += 1;
    item.style.zIndex = String(topLayer);
    item.setPointerCapture(down.pointerId);
    let moved = false;

    /** @param {PointerEvent} move */
    const onMove = (move) => {
        const dx = move.clientX - down.clientX;
        const dy = move.clientY - down.clientY;
        if (!moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        if (!moved) {
            moved = true;
            item.dataset.dragged = 'true';
            item.classList.add('is-dragging');
            item.querySelectorAll('canvas[data-perch]').forEach((bird) => bird.dispatchEvent(new CustomEvent('perch:fly')));
        }
        const x = clamp(start.x + dx, limits.minX, limits.maxX);
        const y = clamp(start.y + dy, limits.minY, limits.maxY);
        offsets.set(item, { x, y });
        item.style.translate = `${x}px ${y}px`;
    };

    const onEnd = () => {
        dragging = false;
        item.classList.remove('is-dragging');
        item.removeEventListener('pointermove', onMove);
        item.removeEventListener('pointerup', onEnd);
        item.removeEventListener('pointercancel', onEnd);
        if (item.hasPointerCapture(down.pointerId)) item.releasePointerCapture(down.pointerId);
    };

    item.addEventListener('pointermove', onMove);
    item.addEventListener('pointerup', onEnd);
    item.addEventListener('pointercancel', onEnd);
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
