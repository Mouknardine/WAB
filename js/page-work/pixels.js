// @ts-check
/**
 * WAB. — page Work : « WAB. » en pixels, au pied de la page
 * Les modules de l'accueil (js/desk) font arriver les pixels de
 * gauche à droite quand le nom entre à l'écran. Chargés à la
 * demande : s'ils manquent, le nom reste simplement visible.
 */

import { report } from './report.js?v=1';

export function initFootPixels() {
    if (!document.querySelector('.pixel-name')) return;
    Promise.all([import('../desk/pixels.js?v=2'), import('../desk/watch.js?v=1')])
        .then(([pixels, watch]) => {
            pixels.initPixels();
            watch.initWatch();
        })
        .catch((error) => {
            // Sans eux, rien n'a été armé : le nom reste visible.
            document.querySelectorAll('.pixel-name.is-armed').forEach((name) => name.classList.remove('is-armed'));
            report('pixels', error);
        });
}
