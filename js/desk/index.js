// @ts-check
/**
 * WAB OS — accueil
 * Point d'entrée des comportements propres à l'accueil : les éléments qui s'animent à leur arrivée à l'écran
 * (bulles des cartes et de l'appel final), et le premier écran : pixels bleus au passage, nom qui se brouille. Le système partagé (shell, ⌘K, fenêtres, lumière de l'heure)
 * part de js/os/index.js.
 *
 * Chaque module est indépendant : si l'un échoue, les autres
 * continuent, et la page reste entièrement lisible sans eux.
 */

// Même numéro partout où un fichier est importé : sinon le navigateur le charge deux fois.
import { initWatch } from './watch.js?v=1';
import { initPixels } from './pixels.js?v=8';
import { initScramble } from './scramble.js?v=3';

/** @type {Array<[string, () => void]>} */
const MODULES = [
    ['watch', initWatch],
    ['scramble', initScramble],
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
