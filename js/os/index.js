// @ts-check
/**
 * WAB OS — point d'entrée partagé par toutes les pages
 * La lumière de l'heure de Lausanne et le shell (⌘K, terminal, menu du clic droit,
 * dock, fenêtres à la demande), le sommaire de la page dans le dock, les motifs de pixels des marges et le bruit des touches. Chaque module est indépendant : si l'un échoue, les autres
 * continuent, et la page reste entièrement utilisable sans eux.
 *
 *   <script type="module" src="/js/os/index.js?v=N"></script> (N : relevé à chaque changement)
 */

import { initSky } from './sky.js?v=1';
import { initShell } from './shell.js?v=8';
import { initToc } from './toc.js?v=1';
import { initKeySound } from './keysound.js?v=1';
import { initMargins } from '../desk/pixels-margins.js?v=4';
import { report } from './lazy.js?v=1';

/** @type {Array<[string, () => void]>} */
const MODULES = [
    ['sky', initSky],
    ['shell', initShell],
    ['toc', initToc],
    ['keysound', initKeySound],
    ['margins', initMargins],
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
