// @ts-check
/**
 * WAB OS — sélectionner ou ouvrir
 * À la souris, comme sur un bureau : un clic sélectionne, un
 * double-clic ouvre. Au clavier (Entrée, Espace) et au doigt, le
 * geste ouvre directement : personne ne double-tape un écran.
 */

/** @type {string} */
let lastPointer = 'mouse';

document.addEventListener('pointerdown', (event) => {
    lastPointer = event.pointerType || 'mouse';
}, { capture: true, passive: true });

/**
 * Un clic venu du clavier n'a pas de « detail » (0) ; un toucher
 * vient d'un pointeur autre que la souris.
 * @param {MouseEvent} event
 * @returns {boolean}
 */
export function isOpenGesture(event) {
    return event.detail === 0 || lastPointer !== 'mouse';
}

/**
 * Sélectionne un objet parmi ses semblables (une seule sélection).
 * @param {HTMLElement} target
 * @param {string} selector  la famille d'objets concernée
 */
export function select(target, selector) {
    document.querySelectorAll(`${selector}.is-selected`).forEach((node) => node.classList.remove('is-selected'));
    target.classList.add('is-selected');
    if (document.activeElement !== target) target.focus({ preventScroll: true });
}

/** @param {string} selector */
export function clearSelection(selector) {
    document.querySelectorAll(`${selector}.is-selected`).forEach((node) => node.classList.remove('is-selected'));
}
