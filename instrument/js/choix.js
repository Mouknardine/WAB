/**
 * Le choix du pilote : quel geste jouer, selon la densité de l'écran.
 * Trop plein (plus de 55 % de cases) : il éclaircit. Trop vide (moins
 * de 40 %) : il ajoute de la matière. Entre les deux : la table entière.
 */

import { fabriquer } from './gestes.js';
import { noteDeLettre, noteGrande } from './clavier.js';
import { petitEcran } from './jetons.js';
import { NB_TEINTES } from './grille.js';

// Une page claire : le blanc domine, les aplats respirent.
export const DENSITE_MIN = 0.22;
export const DENSITE_MAX = 0.32;
const MOTS = ['WAB', 'FORME', 'PIXEL', 'TRAME', 'SIGNE'];
const LETTRES = 'wab';
const AVANCE = 0.78;
const ECART_LETTRES = 110;

/**
 * @typedef {import('./gestes-dessin.js').Geste} Geste
 * @typedef {{ cols: number, rows: number }} Dimensions
 */

/** @param {readonly string[]} liste @returns {string} */
const auHasard = (liste) => liste[Math.floor(Math.random() * liste.length)];

/**
 * @param {string} type @param {Partial<Geste>} reglages @param {number} t0
 * @returns {Geste}
 */
const geste = (type, reglages, t0) => fabriquer(type, reglages, Math.random, t0);

/**
 * Un mot court, lettre après lettre, sur une ligne lisible.
 * @param {Dimensions} dim
 * @param {number} t0
 * @returns {Geste[]}
 */
function mot(dim, t0) {
    const lettres = Array.from(auHasard(MOTS));
    const cote = Math.min(dim.cols, dim.rows);
    const hauteur = Math.min((dim.cols * 0.86) / (AVANCE * lettres.length), dim.rows * 0.3);
    const avance = (AVANCE * hauteur) / dim.cols;
    const depart = 0.5 - (avance * lettres.length) / 2;
    const y = 0.25 + Math.random() * 0.45;
    const teinte = 1 + Math.floor(Math.random() * NB_TEINTES);
    return lettres.map((lettre, i) => geste('lettre', {
        lettre, teinte, y,
        x: depart + avance * (i + 0.5),
        taille: hauteur / cote,
    }, t0 + i * ECART_LETTRES));
}

/**
 * Une lettre de WAB, à sa place sur le clavier, comme jouée à la main ;
 * sur téléphone, en grand.
 * @param {Dimensions} dim
 * @param {number} t0
 * @returns {Geste[]}
 */
function lettre(dim, t0) {
    const choisie = auHasard(Array.from(LETTRES));
    const teinte = 1 + Math.floor(Math.random() * NB_TEINTES);
    const note = petitEcran() ? noteGrande(choisie, dim, teinte) : noteDeLettre(choisie);
    return note ? [geste(note.type, note.reglages, t0)] : [];
}

/** @param {number} t0 @returns {Geste[]} */
const forme = (t0) => [geste('forme', { forme: auHasard(['carre', 'cercle', 'croix']), taille: 0.14 + Math.random() * 0.12 }, t0)];

/** @type {Record<string, (dim: Dimensions, t0: number) => Geste[]>} */
const AJOUTS = {
    forme: (_d, t0) => forme(t0),
    aplat: (_d, t0) => [geste('aplat', {}, t0)],
    pluie: (_d, t0) => [geste('pluie', {}, t0)],
    lettre: (d, t0) => lettre(d, t0),
    mot: (d, t0) => mot(d, t0),
};

/** @type {Record<string, (dim: Dimensions, t0: number) => Geste[]>} */
const TABLE = {
    ...AJOUTS,
    vague: (_d, t0) => [geste('vague', {}, t0)],
    miroir: (_d, t0) => [geste('miroir', { axe: Math.random() < 0.5 ? 'v' : 'h' }, t0)],
    decalage: (_d, t0) => [geste('decalage', {}, t0)],
    dispersion: (_d, t0) => [geste('dispersion', { taille: 0.3 }, t0)],
};

/**
 * @param {number} densite  part des cases pleines
 * @param {Dimensions} dim
 * @param {number} t0
 * @returns {Geste[]}
 */
export function choisirGestes(densite, dim, t0) {
    if (densite > DENSITE_MAX) {
        return [geste('eclaircir', { taille: 0.2 + Math.random() * 0.1 }, t0)];
    }
    const table = densite < DENSITE_MIN ? AJOUTS : TABLE;
    const nom = auHasard(Object.keys(table));
    return table[nom](dim, t0);
}
