// @ts-check
/**
 * WAB OS — page Création de site internet à Lausanne
 * Les comportements propres à la page : le focus qui suit le
 * défilement dans les formats, et l'arrivée des pixels du pied de page
 * (modules de l'accueil, réutilisés tels quels). Le système partagé
 * (⌘K, lumière de l'heure, reflet des boutons) part de js/os/index.js.
 *
 * Chaque module est indépendant : si l'un échoue, les autres
 * continuent, et la page reste entièrement lisible sans eux.
 */

// Même numéro que dans js/desk/index.js : un seul fichier en cache.
import { initWatch } from '../desk/watch.js?v=1';
import { initPixels } from '../desk/pixels.js?v=2';
import { initFocus } from './focus.js?v=1';

/** @type {Array<[string, () => void]>} */
const MODULES = [
    ['focus', initFocus],
    ['pixels', initPixels],
    ['watch', initWatch],
];

function boot() {
    for (const [name, init] of MODULES) {
        try {
            init();
        } catch (error) {
            // Un module en panne n'emporte pas les autres : on le signale
            // sur la racine (lisible en inspectant), sans bruit console.
            document.documentElement.dataset.pageError = name;
            if (error instanceof Error) {
                document.documentElement.dataset.pageErrorMessage = error.message;
            }
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
