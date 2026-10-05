// @ts-check
/**
 * WAB OS — le gestionnaire de fenêtres
 * Ouvrir, passer devant, déplacer, agrandir, réduire dans le dock,
 * rouvrir, fermer. Sur ordinateur, les fenêtres sont des <dialog>
 * non modaux (plusieurs à la fois, la page reste utilisable) ; Échap
 * ferme celle qui a le focus. Sur téléphone, elles s'ouvrent en
 * feuille plein écran, modales : le navigateur garde le focus dedans.
 * À la fermeture, le focus revient à ce qui a ouvert la fenêtre.
 */

import { buildFrame } from './wm-frame.js?v=1';
import { wire } from './wm-wire.js?v=2';
import { markOpen, shelve, unshelve, dockVisible, onDockVisibility } from './dock.js?v=2';

const Z_BASE = 130;
const CASCADE = 28;
const sheetQuery = window.matchMedia('(max-width: 759px)');

/**
 * @typedef {object} OsWindow
 * @property {string} id
 * @property {string} app
 * @property {string} title
 * @property {string} icon
 * @property {HTMLDialogElement} el
 * @property {HTMLElement} body
 * @property {HTMLElement | null} opener
 * @property {boolean} minimized
 * @property {boolean} sheet
 * @property {{ x: number, y: number }} pos
 * @property {() => HTMLElement | null} focusTarget
 */

/**
 * @typedef {object} WinSpec
 * @property {string} id
 * @property {string} title
 * @property {string} icon
 * @property {string} app
 * @property {'lg' | 'md' | 'sm' | 'xs'} size
 * @property {HTMLElement | null} opener
 * @property {(win: OsWindow) => void} build
 * @property {(win: OsWindow) => HTMLElement | null} [focus]
 */

/** @type {OsWindow[]} Les fenêtres ouvertes, la dernière dessus. */
const stack = [];

/** @param {string} id */
export function getWindow(id) {
    return stack.find((win) => win.id === id) ?? null;
}

/** @param {OsWindow} win */
function syncDock(win) {
    markOpen(win.app, stack.some((other) => other.app === win.app));
}

/** @param {OsWindow} win */
function raise(win) {
    const index = stack.indexOf(win);
    if (index !== -1 && index !== stack.length - 1) {
        stack.splice(index, 1);
        stack.push(win);
    }
    stack.forEach((other, i) => {
        other.el.style.zIndex = String(Z_BASE + i);
        other.el.classList.toggle('is-active', other === win);
    });
}

/** @param {OsWindow} win @param {number} x @param {number} y */
function place(win, x, y) {
    const { offsetWidth: w } = win.el;
    const bar = parseFloat(getComputedStyle(document.body).getPropertyValue('--bar-h')) || 44;
    win.pos = {
        x: Math.min(window.innerWidth - 96, Math.max(96 - w, x)),
        y: Math.min(window.innerHeight - 48, Math.max(bar + 6, y)),
    };
    win.el.style.translate = `${Math.round(win.pos.x)}px ${Math.round(win.pos.y)}px`;
}

/** @param {OsWindow} win  centrée, en cascade sur les autres */
function placeInitial(win) {
    const shift = (stack.filter((other) => !other.minimized).length - 1) % 5 * CASCADE;
    const x = (window.innerWidth - win.el.offsetWidth) / 2 + shift;
    const y = Math.max(64, (window.innerHeight - win.el.offsetHeight) / 2 - 24) + shift;
    place(win, x, y);
}

/** @param {OsWindow} win */
function focusInside(win) {
    const target = win.focusTarget() ?? win.el;
    target.focus({ preventScroll: true });
}

/** @param {OsWindow} win */
function show(win) {
    win.sheet = sheetQuery.matches;
    win.el.classList.toggle('is-sheet', win.sheet);
    if (win.sheet) {
        win.el.showModal();
        document.documentElement.classList.add('has-modal');
    } else {
        win.el.show();
        if (!win.pos.x && !win.pos.y) placeInitial(win);
    }
    win.el.querySelector('.oswin__ctl--min')?.toggleAttribute('hidden', win.sheet || !dockVisible());
    raise(win);
    focusInside(win);
}

/** @param {OsWindow} win */
function handBackFocus(win) {
    const next = [...stack].reverse().find((other) => !other.minimized);
    const opener = win.opener;
    if (opener?.isConnected && opener.getClientRects().length) opener.focus({ preventScroll: true });
    else if (next) focusInside(next);
    if (next) raise(next);
}

/** @param {OsWindow} win */
export function closeWindow(win) {
    const index = stack.indexOf(win);
    if (index === -1) return;
    stack.splice(index, 1);
    unshelve(win.id);
    if (win.el.open) win.el.close();
    win.el.remove();
    if (!stack.some((other) => other.sheet && other.el.open)) {
        document.documentElement.classList.remove('has-modal');
    }
    syncDock(win);
    handBackFocus(win);
}

/** @param {OsWindow} win */
function minimize(win) {
    if (!dockVisible()) return;
    win.minimized = true;
    win.el.close();
    const button = shelve(win, () => restore(win));
    button?.focus({ preventScroll: true });
}

/** @param {OsWindow} win */
function restore(win) {
    win.minimized = false;
    unshelve(win.id);
    show(win);
}

/**
 * Ouvre une fenêtre, ou ramène devant celle qui porte déjà cet id.
 * @param {WinSpec} spec
 * @returns {OsWindow}
 */
export function openWindow(spec) {
    const existing = getWindow(spec.id);
    if (existing) {
        if (spec.opener) existing.opener = spec.opener;
        if (existing.minimized) restore(existing);
        else {
            raise(existing);
            focusInside(existing);
        }
        return existing;
    }

    const frame = buildFrame(spec);
    /** @type {OsWindow} */
    const win = {
        id: spec.id,
        app: spec.app,
        title: spec.title,
        icon: spec.icon,
        el: frame.el,
        body: frame.body,
        opener: spec.opener,
        minimized: false,
        sheet: false,
        pos: { x: 0, y: 0 },
        focusTarget: () => (spec.focus ? spec.focus(win) : null),
    };
    wire(win, frame, { close: closeWindow, minimize, raise, place });
    spec.build(win);
    document.body.append(frame.el);
    stack.push(win);
    show(win);
    syncDock(win);
    return win;
}

// Le dock disparaît (navigateur rétréci) : les fenêtres réduites reviennent.
onDockVisibility((visible) => {
    if (visible) return;
    stack.filter((win) => win.minimized).forEach(restore);
});
