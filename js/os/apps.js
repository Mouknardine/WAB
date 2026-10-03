// @ts-check
/**
 * WAB OS — les lanceurs
 * Chaque app (dossier Work, fiche projet, terminal, corbeille,
 * palette, menu du clic droit) n'est chargée qu'à sa première
 * ouverture : sa feuille de style, puis son module. Si le chargement
 * échoue, le visiteur n'est jamais bloqué : on l'envoie vers la page
 * qui contient la même chose, ou on le lui dit.
 */

import { loadStyle, report } from './lazy.js?v=1';
import { toast } from './toast.js?v=1';
import { goTo } from './actions.js?v=1';

/** @param {...string} names */
function styles(...names) {
    return Promise.all(['os-win', 'os-win-states', ...names].map((name) => loadStyle(name, 2)));
}

/**
 * @param {string} name
 * @param {() => Promise<void>} task
 * @param {() => void} fallback
 */
function launch(name, task, fallback) {
    task().catch((error) => {
        report(name, error);
        fallback();
    });
}

/** @param {HTMLElement | null} opener */
export function launchFinder(opener) {
    launch('finder', async () => {
        await styles('os-finder');
        (await import('./finder.js?v=2')).openFinder(opener);
    }, () => goTo('/realisations'));
}

/**
 * @param {string} id
 * @param {string} title
 * @param {HTMLElement | null} opener
 */
export function launchCase(id, title, opener) {
    launch('case', async () => {
        await styles('os-case');
        (await import('./case.js?v=1')).openCase(id, title, opener);
    }, () => goTo(`/realisations#${encodeURIComponent(id)}`));
}

/** @param {HTMLElement | null} opener */
export function launchTerminal(opener) {
    launch('terminal', async () => {
        await styles('os-terminal');
        (await import('./terminal.js?v=2')).openTerminal(opener);
    }, () => toast('Le terminal n’a pas pu s’ouvrir.'));
}

/** @param {HTMLElement | null} opener */
export function launchTrash(opener) {
    launch('trash', async () => {
        await styles();
        (await import('./trash.js?v=1')).openTrash(opener);
    }, () => toast('La corbeille est vide.'));
}

/** @param {HTMLElement | null} opener */
export function launchPalette(opener) {
    launch('palette', async () => {
        await loadStyle('os-palette', 2);
        (await import('./palette.js?v=2')).togglePalette(opener);
    }, () => toast('La recherche n’a pas pu s’ouvrir.'));
}

/** @param {number} x @param {number} y */
export function launchMenu(x, y) {
    launch('menu', async () => {
        await loadStyle('os-menu', 2);
        (await import('./menu.js?v=2')).openMenu(x, y);
    }, () => {});
}
