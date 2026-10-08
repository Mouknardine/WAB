// @ts-check
/**
 * WAB OS — le câblage d'une fenêtre
 * Les pastilles, le double-clic sur la barre (agrandir), le passage
 * au premier plan au clic ou au focus, Échap, et le déplacement par
 * la barre.
 */

import { makeMovable } from './wm-frame.js?v=1';

/**
 * @typedef {object} Actions
 * @property {(win: import('./wm.js').OsWindow) => void} close
 * @property {(win: import('./wm.js').OsWindow) => void} minimize
 * @property {(win: import('./wm.js').OsWindow) => void} raise
 * @property {(win: import('./wm.js').OsWindow, x: number, y: number) => void} place
 */

/**
 * @param {import('./wm.js').OsWindow} win
 * @param {import('./wm-frame.js').Frame} frame
 * @param {Actions} actions
 */
export function wire(win, frame, actions) {
    const { el, bar } = frame;
    frame.close.addEventListener('click', () => actions.close(win));
    frame.min.addEventListener('click', () => actions.minimize(win));
    const toggleMax = () => {
        const max = el.classList.toggle('is-max');
        frame.max.setAttribute('aria-pressed', String(max));
    };
    frame.max.addEventListener('click', toggleMax);
    bar.addEventListener('dblclick', (event) => {
        if (!(event.target instanceof Element && event.target.closest('button')) && !win.sheet) toggleMax();
    });
    el.addEventListener('pointerdown', () => actions.raise(win), { capture: true });
    el.addEventListener('focusin', () => actions.raise(win));
    el.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || event.defaultPrevented) return;
        event.preventDefault();
        actions.close(win);
    });
    // Feuille modale : Échap passe par « cancel », qu'on ramène ici.
    el.addEventListener('cancel', (event) => {
        event.preventDefault();
        actions.close(win);
    });
    makeMovable(bar, {
        canMove: () => !win.sheet && !el.classList.contains('is-max'),
        get: () => win.pos,
        set: (x, y) => actions.place(win, x, y),
    });
}
