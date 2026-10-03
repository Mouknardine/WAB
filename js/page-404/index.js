// @ts-check
/**
 * WAB OS — page introuvable (404) : point d'entrée
 * Le chemin demandé dans la barre de la boîte de dialogue, puis les
 * pixels du pied de page (pièces de l'accueil réemployées). Le système
 * (⌘K, clic droit, lumière de l'heure, reflet des boutons) vient de
 * js/os. Si un module échoue, les autres continuent.
 */

// Mêmes numéros que dans js/desk/index.js : un seul exemplaire chargé.
import { initWatch } from '../desk/watch.js?v=1';
import { initPixels } from '../desk/pixels.js?v=2';
import { initPath } from './path.js?v=1';

/** @type {Array<[string, () => void]>} */
const MODULES = [
    ['path', initPath],
    ['watch', initWatch],
    ['pixels', initPixels],
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
