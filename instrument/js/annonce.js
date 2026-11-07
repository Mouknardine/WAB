/**
 * Annonce discrète pour les lecteurs d'écran : un seul message, une fois
 * qu'on a cessé de jouer, plutôt qu'une annonce par touche.
 */

import { decrire } from './gestes.js';

const PAUSE = 900;

/**
 * @typedef {import('./gestes-dessin.js').Geste} Geste
 * @param {HTMLElement} region  élément aria-live="polite"
 * @returns {{ signaler: (geste: Geste) => void, dire: (phrase: string) => void }}
 */
export function creerAnnonce(region) {
    let compte = 0;
    let dernier = '';
    let attente = 0;

    const dire = (/** @type {string} */ phrase) => {
        window.clearTimeout(attente);
        attente = window.setTimeout(() => {
            region.textContent = phrase;
        }, PAUSE);
    };

    return {
        signaler(geste) {
            compte += 1;
            dernier = decrire(geste);
            dire(`${compte} geste${compte > 1 ? 's' : ''} joué${compte > 1 ? 's' : ''}, le dernier : ${dernier}.`);
        },
        dire(phrase) {
            compte = 0;
            dire(phrase);
        },
    };
}
