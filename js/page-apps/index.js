// @ts-check
/**
 * WAB OS — page Applications : point d'entrée
 * Les onglets de l'application (tabs.js), puis trois pièces de
 * l'accueil réemployées telles quelles : le focus qui suit le
 * défilement dans les blocs en quinconce, les captures qui ne défilent
 * qu'à l'écran, et les pixels du pied de page. Le système (⌘K, clic
 * droit, lumière de l'heure, reflet des boutons) vient de js/os.
 *
 * Chaque module est indépendant : si l'un échoue, les autres
 * continuent, et la page reste entièrement lisible sans eux.
 */

// Mêmes numéros que dans js/desk/index.js : un seul exemplaire chargé.
import { initWatch } from '../desk/watch.js?v=1';
import { initPixels } from '../desk/pixels.js?v=2';
import { initFocusScroll } from '../desk/focus-scroll.js?v=1';
import { initTabs } from './tabs.js?v=1';

/** @type {Array<[string, () => void]>} */
const MODULES = [
    ['tabs', initTabs],
    ['watch', initWatch],
    ['pixels', initPixels],
    ['focus-scroll', initFocusScroll],
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
            // Signalé sur la page (lisible en inspectant), sans bruit
            // dans la console du visiteur.
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
