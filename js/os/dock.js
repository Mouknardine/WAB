// @ts-check
/**
 * WAB OS — le dock, côté fenêtres
 * Le point sous une app dont une fenêtre est ouverte, et l'étagère
 * des fenêtres réduites, après le séparateur. Le dock n'existe qu'à
 * la souris sur grand écran : ailleurs, on ne réduit pas (la fenêtre
 * n'aurait nulle part où revenir).
 */

import { appIcon, el } from './dom.js?v=3';

const dock = document.querySelector('[data-dock]');
const shelf = document.querySelector('[data-dock-shelf]');
const visibleQuery = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');

/** @returns {boolean} */
export function dockVisible() {
    return Boolean(dock) && visibleQuery.matches;
}

/** @param {(visible: boolean) => void} listener */
export function onDockVisibility(listener) {
    visibleQuery.addEventListener('change', () => listener(dockVisible()));
}

/**
 * @param {string} app
 * @param {boolean} open
 */
export function markOpen(app, open) {
    dock?.querySelectorAll(`.dock__apps [data-app="${app}"]`).forEach((item) => {
        item.classList.toggle('is-open', open);
    });
}

/**
 * Range une fenêtre réduite sur l'étagère, avec l'icône de son app
 * (une fiche projet garde l'icône de document).
 * @param {{ id: string, title: string, icon: string, app: string }} win
 * @param {() => void} onRestore
 * @returns {HTMLButtonElement | null}
 */
export function shelve(win, onRestore) {
    if (!(shelf instanceof HTMLElement)) return null;
    const item = el('li');
    item.dataset.win = win.id;
    const button = el('button', 'dock__item');
    button.type = 'button';
    button.append(appIcon(win.icon === 'file' ? 'file' : win.app, 40), el('span', 'dock__label', `Rouvrir ${win.title}`));
    button.addEventListener('click', onRestore);
    item.append(button);
    shelf.append(item);
    shelf.hidden = false;
    return button;
}

/** @param {string} id */
export function unshelve(id) {
    if (!(shelf instanceof HTMLElement)) return;
    shelf.querySelectorAll('li').forEach((item) => {
        if (item.dataset.win === id) item.remove();
    });
    shelf.hidden = shelf.children.length === 0;
}
