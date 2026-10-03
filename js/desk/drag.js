// @ts-check
/**
 * WAB. — Les fenêtres qu'on déplace
 * Sur ordinateur, chaque objet marqué [data-drag] se prend à la
 * souris et se repose ailleurs, comme sur un vrai bureau. Celui
 * qu'on prend passe au premier plan.
 *
 * Le déplacement passe par la propriété `translate` : il se compose
 * avec la parallaxe (transform), l'inclinaison (rotate) et l'entrée
 * (scale) sans jamais les écraser.
 *
 * Au doigt, rien : un glisser bloquerait le défilement de la page.
 * Ces objets sont un décor, la page ne dépend jamais d'eux.
 */

/** Ce qui doit rester visible d'un objet poussé hors du bureau. */
const KEEP_VISIBLE = 48;

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

export function initDrag() {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return;

    const items = document.querySelectorAll('[data-drag]');
    items.forEach((item) => {
        if (item instanceof HTMLElement) makeDraggable(item);
    });
}

/** @param {HTMLElement} item */
function makeDraggable(item) {
    item.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 || dragging) return;
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
    topLayer += 1;
    item.style.zIndex = String(topLayer);
    item.classList.add('is-dragging');
    item.setPointerCapture(down.pointerId);

    /** @param {PointerEvent} move */
    const onMove = (move) => {
        const x = clamp(start.x + move.clientX - down.clientX, limits.minX, limits.maxX);
        const y = clamp(start.y + move.clientY - down.clientY, limits.minY, limits.maxY);
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
