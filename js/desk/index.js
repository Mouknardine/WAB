// @ts-check
/**
 * WAB OS — accueil
 * Point d'entrée des comportements propres à l'accueil : la lumière
 * de l'heure, les objets qu'on déplace, la parallaxe douce, la
 * vitrine des projets, les éléments qui s'animent à l'écran, la
 * nuée d'oiseaux autour de la lettre, les pixels du pied de page,
 * le fond animé des cartes de prestation. Le système partagé (shell, ⌘K, fenêtres,
 * lumière de l'heure, reflet des boutons) part de js/os/index.js.
 *
 * Chaque module est indépendant : si l'un échoue, les autres
 * continuent, et la page reste entièrement lisible sans eux.
 */

// Même numéro partout où un fichier est importé : voir js/birds/index.js.
import { initDrag } from './drag.js?v=3';
import { initParallax } from './parallax.js?v=2';
import { initShowcase } from './showcase.js?v=2';
import { initWatch } from './watch.js?v=1';
import { initPixels } from './pixels.js?v=2';
import { initFocusScroll } from './focus-scroll.js?v=1';
import { initArrival } from './arrival.js?v=3';
import { initNodalLines } from './nodal-lines.js?v=1';

/** @type {Array<[string, () => void]>} */
const MODULES = [
    ['drag', initDrag],
    ['parallax', initParallax],
    ['showcase', initShowcase],
    ['watch', initWatch],
    ['pixels', initPixels],
    ['focus-scroll', initFocusScroll],
    ['arrival', initArrival],
    ['nodal-lines', initNodalLines],
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
