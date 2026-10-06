// @ts-check
/**
 * WAB OS — page Création de site internet à Lausanne
 * Le comportement propre à la page : le focus qui suit le
 * défilement dans les formats. Le système partagé
 * (⌘K, lumière de l'heure, reflet des boutons) part de js/os/index.js.
 *
 * Chaque module est indépendant : si l'un échoue, les autres
 * continuent, et la page reste entièrement lisible sans eux.
 */

import { initFocus } from './focus.js?v=1';

/** @type {Array<[string, () => void]>} */
const MODULES = [
    ['focus', initFocus],
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
