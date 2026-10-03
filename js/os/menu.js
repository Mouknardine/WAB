// @ts-check
/**
 * WAB OS — le menu du clic droit
 * Sur le bureau : Nouveau projet…, Voir le travail, Copier l'email,
 * Rechercher. Le menu natif reste sur les liens, les champs, le texte
 * sélectionné et dans les fenêtres (voir shell.js).
 * Modèle menu ARIA : le premier choix prend le focus, flèches haut et
 * bas, Début et Fin, Entrée ; Échap, Tab, un clic ailleurs ou le
 * défilement le referment et rendent le focus.
 */

import { el } from './dom.js?v=2';
import { openContact, copyEmail, SHORTCUT } from './actions.js?v=1';
import { launchFinder, launchPalette } from './apps.js?v=2';

/** @type {HTMLElement | null} */
let menu = null;
/** @type {HTMLElement | null} */
let returnFocus = null;
/** @type {AbortController | null} */
let outside = null;

/** @type {Array<{ label: string, hint?: string, run: () => void }>} */
const ENTRIES = [
    { label: 'Nouveau projet…', run: () => openContact() },
    { label: 'Voir le travail', run: () => launchFinder(returnFocus) },
    { label: 'Copier l’email', run: () => { copyEmail(); } },
    { label: 'Rechercher…', hint: SHORTCUT, run: () => launchPalette(returnFocus) },
];

function close() {
    outside?.abort();
    outside = null;
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    const target = returnFocus;
    if (target?.isConnected && target.getClientRects().length) target.focus({ preventScroll: true });
}

/** @param {number} delta */
function move(delta) {
    if (!menu) return;
    const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
    const index = items.indexOf(/** @type {Element} */ (document.activeElement));
    const next = items[(index + delta + items.length) % items.length];
    if (next instanceof HTMLElement) next.focus();
}

/** @returns {HTMLElement} */
function build() {
    const root = el('div', 'os-menu');
    root.setAttribute('role', 'menu');
    root.setAttribute('aria-label', 'Bureau');
    root.hidden = true;
    ENTRIES.forEach((entry, i) => {
        if (i === 3) {
            const sep = el('div', 'os-menu__sep');
            sep.setAttribute('role', 'separator');
            root.append(sep);
        }
        const item = el('button', 'os-menu__item');
        item.type = 'button';
        item.setAttribute('role', 'menuitem');
        item.tabIndex = -1;
        item.append(el('span', '', entry.label));
        if (entry.hint) item.append(el('kbd', 'os-menu__hint', entry.hint));
        item.addEventListener('click', () => {
            close();
            entry.run();
        });
        root.append(item);
    });
    root.addEventListener('keydown', (event) => {
        const keys = { ArrowDown: 1, ArrowUp: -1 };
        if (event.key in keys) move(keys[/** @type {'ArrowDown' | 'ArrowUp'} */ (event.key)]);
        else if (event.key === 'Home') move(-99);
        else if (event.key === 'End') move(99);
        else if (event.key === 'Escape' || event.key === 'Tab') close();
        else return;
        event.preventDefault();
    });
    document.body.append(root);
    return root;
}

/**
 * @param {number} x
 * @param {number} y
 */
export function openMenu(x, y) {
    menu ??= build();
    returnFocus = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
        ? document.activeElement
        : null;
    menu.hidden = false;
    const { offsetWidth: w, offsetHeight: h } = menu;
    menu.style.translate = `${Math.round(Math.min(x, window.innerWidth - w - 8))}px ${Math.round(Math.min(y, window.innerHeight - h - 8))}px`;
    menu.querySelector('button')?.focus({ preventScroll: true });

    outside?.abort();
    outside = new AbortController();
    const { signal } = outside;
    // Écoutés au prochain tour : le clic droit qui ouvre ne referme pas.
    window.setTimeout(() => {
        document.addEventListener('pointerdown', (event) => {
            if (!(event.target instanceof Node && menu?.contains(event.target))) close();
        }, { signal, capture: true });
        window.addEventListener('scroll', close, { signal, passive: true });
        window.addEventListener('blur', close, { signal });
    }, 0);
}
