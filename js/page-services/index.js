// @ts-check
/**
 * Services — point d'entrée de la page
 * Le focus qui suit le défilement dans les deux familles, les éléments
 * qui s'animent à l'écran (les notifications des automatisations, les
 * pixels du pied de page) : ces deux derniers reprennent les modules
 * de l'accueil, avec les mêmes numéros de version pour que le
 * navigateur ne les charge qu'une fois.
 *
 * Chaque module est indépendant : si l'un échoue, les autres
 * continuent, et la page reste entièrement lisible sans eux — les
 * notifications ne sont masquées qu'une fois le script prêt
 * (.is-armed), jamais avant.
 */

import { initWatch } from '../desk/watch.js?v=1';
import { initPixels } from '../desk/pixels.js?v=2';
import { initFocus } from './focus.js?v=1';

/** Les notifications attendent leur arrivée, puisque watch.js est là. */
function armNotifications() {
    document.querySelectorAll('.svc-notifs[data-watch]').forEach((el) => el.classList.add('is-armed'));
}

/** @type {Array<[string, () => void]>} */
const MODULES = [
    ['focus', initFocus],
    ['watch', () => {
        initWatch();
        armNotifications();
    }],
    ['pixels', initPixels],
];

/** @param {string} name @param {unknown} error */
function report(name, error) {
    // Signalé sur la page (attribut lisible en inspectant), sans bruit
    // dans la console du visiteur.
    document.documentElement.dataset.servicesError = name;
    if (typeof window.reportError === 'function') window.reportError(error);
}

function boot() {
    for (const [name, init] of MODULES) {
        try {
            init();
        } catch (error) {
            report(name, error);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
