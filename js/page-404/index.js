// @ts-check
/**
 * WAB OS — page introuvable (404) : point d'entrée
 * Le chemin demandé dans la barre de la boîte de dialogue. Le système
 * (⌘K, clic droit, lumière de l'heure, reflet des boutons) vient de
 * js/os. Si un module échoue, les autres continuent.
 */

import { initPath } from './path.js?v=1';

/** @type {Array<[string, () => void]>} */
const MODULES = [
    ['path', initPath],
];

/** @param {unknown} error */
function reportError(error) {
    if (typeof window.reportError === 'function') window.reportError(error);
}

function boot() {
    for (const [name, init] of MODULES) {
        try {
            init();
        } catch (error) {
            document.documentElement.dataset.pageError = name;
            reportError(error);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
