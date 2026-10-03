// @ts-check
/**
 * WAB. — page Work : les fiches et l'adresse
 * Une fiche s'ouvre dans la fenêtre de verre du système partagé
 * (js/os : clic sur un lien data-card). Ce module ajoute deux choses :
 *
 * — l'adresse : arriver sur /realisations#zinema (lien partagé, lien
 *   de l'accueil sans JavaScript, ancre d'une autre page) ouvre la
 *   fiche du projet, en plus de défiler jusqu'à lui ;
 * — le clavier : avec JavaScript, le bouton « Ouvrir la fiche » est
 *   le seul arrêt de tabulation par projet. La grande fenêtre reste
 *   cliquable à la souris, sans doubler l'arrêt au clavier.
 *
 * Sans JavaScript, la fenêtre reste un lien vers le site du client.
 */

import { report } from './report.js?v=1';

/** @returns {HTMLElement[]} */
function casePieces() {
    return Array.from(document.querySelectorAll('.piece[id]'))
        .filter((node) => node instanceof HTMLElement && node.querySelector('.piece__case'));
}

/** @param {HTMLElement[]} pieces */
function openFromHash(pieces) {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const piece = pieces.find((node) => node.id === id);
    if (!piece) return;
    const opener = piece.querySelector('.piece__open');
    const title = opener instanceof HTMLElement ? opener.dataset.title ?? id : id;
    import('../os/apps.js?v=1')
        .then((apps) => apps.launchCase(id, title, opener instanceof HTMLElement ? opener : null))
        .catch((error) => report('case-links', error));
}

export function initCaseLinks() {
    const pieces = casePieces();
    pieces.forEach((piece) => {
        const link = piece.querySelector('.piece__link');
        if (!(link instanceof HTMLElement)) return;
        link.tabIndex = -1;
        link.setAttribute('aria-hidden', 'true');
    });
    window.addEventListener('hashchange', () => openFromHash(pieces));
    openFromHash(pieces);
}
