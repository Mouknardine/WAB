// @ts-check
/**
 * WAB. — Accueil « bureau »
 * Point d'entrée des comportements propres à l'accueil : fenêtres
 * qu'on déplace, parallaxe douce, vitrine des projets, éléments qui
 * s'animent une fois à l'écran, pixels du pied de page.
 *
 * Chaque module est indépendant : si l'un échoue, les autres
 * continuent, et la page reste entièrement lisible sans eux.
 */

// Même numéro partout où un fichier est importé : voir js/birds/index.js.
import { initDrag } from './drag.js?v=1';
import { initParallax } from './parallax.js?v=1';
import { initShowcase } from './showcase.js?v=1';
import { initWatch } from './watch.js?v=1';
import { initPixels } from './pixels.js?v=1';

/** @type {Array<[string, () => void]>} */
const MODULES = [
    ['drag', initDrag],
    ['parallax', initParallax],
    ['showcase', initShowcase],
    ['watch', initWatch],
    ['pixels', initPixels],
];

function boot() {
    for (const [name, init] of MODULES) {
        try {
            init();
        } catch (error) {
            // Un module en panne ne doit pas emporter les autres : on
            // le signale sur la page (attribut lisible en inspectant),
            // sans bruit dans la console du visiteur.
            document.documentElement.dataset.deskError = name;
            reportError(error);
        }
    }
}

/** @param {unknown} error */
function reportError(error) {
    if (typeof window.reportError === 'function') {
        window.reportError(error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
