// @ts-check
/**
 * WAB OS — point d'entrée partagé par toutes les pages
 * La lumière de l'heure de Lausanne, le reflet des boutons de verre et
 * le shell (⌘K, terminal, menu du clic droit, dock, fenêtres à la
 * demande). Chaque module est indépendant : si l'un échoue, les autres
 * continuent, et la page reste entièrement utilisable sans eux.
 *
 *   <script type="module" src="/js/os/index.js?v=1"></script>
 */

import { initSky } from './sky.js?v=1';
import { initGlass } from './glass.js?v=1';
import { initShell } from './shell.js?v=1';
import { report } from './lazy.js?v=1';

/** @type {Array<[string, () => void]>} */
const MODULES = [
    ['sky', initSky],
    ['glass', initGlass],
    ['shell', initShell],
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
