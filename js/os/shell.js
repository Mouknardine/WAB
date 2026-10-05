// @ts-check
/**
 * WAB OS — le shell
 * Le seul morceau du système chargé d'emblée, et il est léger : il
 * écoute le bureau, le dock, ⌘K et le clic droit, et ne charge une
 * app qu'au moment où on l'ouvre (apps.js).
 *
 * Sans lui, rien ne manque : les fenêtres du bureau, les cartes du
 * mur et le dossier Work restent des liens vers /realisations, le dock
 * des liens.
 */

import { isOpenGesture, select, clearSelection } from './gesture.js?v=1';
import { launchFinder, launchCase, launchTerminal, launchTrash, launchPalette, launchMenu } from './apps.js?v=4';
import { SHORTCUT } from './actions.js?v=1';
import { report } from './lazy.js?v=1';
import { initDockHide } from './dock-hide.js?v=1';

const DESK_ITEM = '[data-project], [data-desk-icon]';
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

/** @param {MouseEvent} event */
function withModifier(event) {
    return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

/** @param {HTMLElement} item */
function openDeskItem(item) {
    const project = item.dataset.project;
    if (project) {
        const title = item.querySelector('.file-name')?.textContent?.trim() || project;
        launchCase(project, title, item);
        return;
    }
    const app = item.dataset.app;
    if (app === 'work') launchFinder(item);
    else if (app === 'trash') launchTrash(item);
}

/** Le bureau : sélectionner à la souris, ouvrir au double-clic, à Entrée, au doigt. */
function wireDesk() {
    document.addEventListener('click', (event) => {
        if (!(event.target instanceof Element)) return;
        const item = event.target.closest(DESK_ITEM);
        if (!(item instanceof HTMLElement)) {
            if (event.target.closest('[data-scatter]')) clearSelection('.scat');
            return;
        }
        if (withModifier(event)) return;
        event.preventDefault();
        // Un glisser se termine par un clic : il ne doit rien ouvrir.
        if (item.dataset.dragged) {
            delete item.dataset.dragged;
            return;
        }
        if (isOpenGesture(event)) openDeskItem(item);
        else select(item, '.scat');
    });

    document.addEventListener('dblclick', (event) => {
        const item = event.target instanceof Element ? event.target.closest(DESK_ITEM) : null;
        if (item instanceof HTMLElement) openDeskItem(item);
    });
}

/**
 * Le mur : une carte est un document, pas une icône — un clic, un
 * toucher ou Entrée ouvre directement la fiche du projet.
 */
function wireWall() {
    document.addEventListener('click', (event) => {
        const link = event.target instanceof Element ? event.target.closest('a[data-card]') : null;
        if (!(link instanceof HTMLAnchorElement) || withModifier(event)) return;
        event.preventDefault();
        launchCase(link.dataset.card || '', link.dataset.title || link.textContent || '', link);
    });
}

/** Le dock : Work ouvre le dossier, Terminal le terminal. */
function wireDock() {
    document.querySelector('[data-dock]')?.addEventListener('click', (event) => {
        const item = event.target instanceof Element ? event.target.closest('.dock__apps [data-app]') : null;
        if (!(item instanceof HTMLElement) || withModifier(/** @type {MouseEvent} */ (event))) return;
        if (item.dataset.app === 'work') {
            event.preventDefault();
            launchFinder(item);
        } else if (item.dataset.app === 'terminal') {
            launchTerminal(item);
        }
    });
}

/** Une autre fenêtre modale (contact) est ouverte : on ne l'empile pas. */
function modalOpen() {
    return Array.from(document.querySelectorAll('dialog[open]')).some((dialog) => {
        try {
            return dialog.matches(':modal') && !dialog.classList.contains('palette');
        } catch {
            return false;
        }
    });
}

function wirePalette() {
    document.querySelectorAll('[data-shortcut]').forEach((node) => { node.textContent = SHORTCUT; });
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
        if (modalOpen()) return;
        event.preventDefault();
        launchPalette(document.activeElement instanceof HTMLElement ? document.activeElement : null);
    });
    document.querySelectorAll('[data-palette-open]').forEach((button) => {
        button.addEventListener('click', () => launchPalette(/** @type {HTMLElement} */ (button)));
    });
}

/**
 * Le clic droit sur le bureau. Le menu natif reste sur les liens, les
 * boutons, les champs, les images, le texte sélectionné, dans les
 * fenêtres, la barre et le dock.
 */
function wireContextMenu() {
    const keepNative = 'a, button, input, textarea, select, label, img, video, [contenteditable], dialog, .menubar, .dock, .os-menu';
    document.addEventListener('contextmenu', (event) => {
        if (!finePointer.matches || !(event.target instanceof Element)) return;
        if (event.target.closest(keepNative)) return;
        if (!(window.getSelection()?.isCollapsed ?? true)) return;
        event.preventDefault();
        const fromKeyboard = event.clientX === 0 && event.clientY === 0;
        launchMenu(fromKeyboard ? window.innerWidth / 2 : event.clientX, fromKeyboard ? window.innerHeight / 3 : event.clientY);
    });
}

/** L'oiseau qui vient tenir compagnie au curseur : chargé plus tard. */
function wireIdleBird() {
    if (!finePointer.matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.setTimeout(() => {
        import('./idle-bird.js?v=3').then((m) => m.initIdleBird()).catch((error) => report('idle-bird', error));
    }, 4000);
}

export function initShell() {
    wireDesk();
    wireWall();
    wireDock();
    initDockHide();
    wirePalette();
    wireContextMenu();
    wireIdleBird();
}
