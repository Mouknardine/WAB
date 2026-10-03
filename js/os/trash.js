// @ts-check
/**
 * WAB OS — la corbeille
 * Une petite fenêtre, une phrase vraie : le studio code ses sites à
 * la main, sans WordPress ni Wix (voir les services du studio).
 */

import { openWindow } from './wm.js?v=1';
import { el, appIcon, keyLink } from './dom.js?v=2';

/** @param {HTMLElement | null} opener */
export function openTrash(opener) {
    openWindow({
        id: 'trash',
        title: 'Corbeille',
        icon: 'trash',
        app: 'trash',
        size: 'xs',
        opener,
        build: (win) => {
            const box = el('div', 'os-note');
            const title = el('p', 'os-note__title', 'La corbeille est vide.');
            title.tabIndex = -1;
            box.append(
                appIcon('trash', 64),
                title,
                el('p', 'os-note__text', 'Pas de thème tout fait à jeter ici\u00a0: nos sites sont codés à la main, sans WordPress ni Wix.'),
                keyLink('Voir ce qu’on en fait', '/realisations'),
            );
            win.body.append(box);
        },
        focus: (win) => win.body.querySelector('.os-note__title'),
    });
}
