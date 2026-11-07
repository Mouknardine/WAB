/**
 * Compositions toutes faites : l'image d'accueil (toujours la même, pour
 * que l'écran ne soit jamais vide) et la composition au hasard de la
 * touche Entrée.
 */

import { fabriquer } from './gestes.js';
import { noteDeLettre } from './clavier.js';
import { hasard, NB_TEINTES } from './grille.js';
import { petitEcran } from './jetons.js';

const GRAINE_ACCUEIL = 20261106;
const ECART_CASCADE = 45;
// Téléphone : WAB d'un seul tenant, centré, une lettre tous les 0,92 de hauteur
const AVANCE_WAB = 0.92;

/**
 * @typedef {import('./gestes-dessin.js').Geste} Geste
 * @typedef {{ cols: number, rows: number }} Dimensions
 */

/**
 * Sur téléphone, les lettres à leur place sur le clavier sont trop
 * petites : WAB se pose en un mot, au milieu, chaque lettre détourée.
 * @param {Dimensions} dim @param {() => number} rnd @param {number} t @param {number} ecart
 * @returns {Geste[]}
 */
function wabCentre(dim, rnd, t, ecart) {
    const cote = Math.min(dim.cols, dim.rows);
    const hauteur = Math.min((dim.cols * 0.9) / (AVANCE_WAB * 3), dim.rows * 0.3);
    const avance = (AVANCE_WAB * hauteur) / dim.cols;
    const y = 0.35 + rnd() * 0.3;
    const teinte = 1 + Math.floor(rnd() * NB_TEINTES);
    return Array.from('WAB', (lettre, i) => fabriquer('lettre', {
        lettre, teinte, y, detoure: true,
        x: 0.5 + avance * (i - 1),
        taille: hauteur / cote,
    }, rnd, t + i * ecart));
}

/**
 * @param {string} lettre
 * @param {() => number} rnd
 * @param {number} t0
 * @returns {Geste[]}
 */
function jouerLettre(lettre, rnd, t0) {
    const note = noteDeLettre(lettre);
    return note ? [fabriquer(note.type, note.reglages, rnd, t0)] : [];
}

/**
 * Une suite de gestes variés, WAB joué à la fin.
 * @param {() => number} rnd
 * @param {number} maintenant
 * @param {number} ecart  délai entre deux gestes (0 = tout d'un coup)
 * @param {Dimensions} dim
 * @returns {Geste[]}
 */
function suite(rnd, maintenant, ecart, dim) {
    const types = [
        ['aplat', {}], ['pluie', {}], ['vague', {}], ['aplat', {}],
        ['forme', { forme: 'cercle' }], ['forme', { forme: 'carre' }],
        ['forme', { forme: 'croix' }], ['forme', { forme: 'cercle' }],
    ];
    /** @type {Geste[]} */
    const gestes = [];
    let t = maintenant;
    for (const [type, reglages] of types) {
        gestes.push(fabriquer(String(type), Object(reglages), rnd, t));
        t += ecart;
    }
    // WAB se joue en dernier : ses lettres restent au-dessus du reste.
    if (petitEcran()) return [...gestes, ...wabCentre(dim, rnd, t, ecart)];
    for (const lettre of 'wab') {
        gestes.push(...jouerLettre(lettre, rnd, t));
        t += ecart;
    }
    return gestes;
}

/**
 * L'image d'accueil, posée sans mouvement.
 * @param {Dimensions} dim
 * @returns {Geste[]}
 */
export function compositionAccueil(dim) {
    return suite(hasard(GRAINE_ACCUEIL), 0, 0, dim);
}

/**
 * Composition au hasard, jouée en cascade après la touche Entrée.
 * @param {number} maintenant
 * @param {Dimensions} dim
 * @returns {Geste[]}
 */
export function compositionHasard(maintenant, dim) {
    return suite(hasard(Math.floor(Math.random() * 1e9)), maintenant, ECART_CASCADE, dim);
}
