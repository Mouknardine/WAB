// @ts-check
/**
 * WAB. — page Work
 * Point d'entrée des comportements propres à la page : la bascule
 * Icônes / Liste du dossier Work, le focus qui suit le défilement,
 * l'ouverture d'une fiche par l'adresse (#zinema), et l'arrivée des
 * pixels du pied de page. Les fiches elles-mêmes s'ouvrent par le
 * système partagé (js/os, attribut data-card).
 *
 * Chaque module est indépendant : si l'un échoue, les autres
 * continuent, et la page reste entièrement lisible sans eux.
 */

import { initFinderViews } from './finder.js?v=1';
import { initFocus } from './focus.js?v=1';
import { initCaseLinks } from './case-links.js?v=2';
import { initFootPixels } from './pixels.js?v=1';
import { report } from './report.js?v=1';

/** @type {Array<[string, () => void]>} */
const MODULES = [
    ['finder', initFinderViews],
    ['focus', initFocus],
    ['case-links', initCaseLinks],
    ['pixels', initFootPixels],
];

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
