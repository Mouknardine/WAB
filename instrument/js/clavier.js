/**
 * La partition : chaque touche joue toujours le même geste.
 * Les lettres se posent à l'endroit où elles sont sur un clavier suisse
 * (QWERTZ) : taper un mot le dessine à travers l'écran.
 */

import { NB_TEINTES } from './grille.js';

const RANGEES = ['qwertzuiop', 'asdfghjkl', 'yxcvbnm'];
const DECALAGES = [0, 0.35, 0.85];

/**
 * @typedef {{ type: string, reglages: Partial<import('./gestes-dessin.js').Geste> }} Note
 */

/** @type {Record<string, Note>} */
const CHIFFRES = {
    1: { type: 'forme', reglages: { forme: 'carre' } },
    2: { type: 'forme', reglages: { forme: 'cercle' } },
    3: { type: 'forme', reglages: { forme: 'croix' } },
    4: { type: 'vague', reglages: {} },
    5: { type: 'pluie', reglages: {} },
    6: { type: 'aplat', reglages: {} },
    7: { type: 'miroir', reglages: { axe: 'v' } },
    8: { type: 'miroir', reglages: { axe: 'h' } },
    9: { type: 'dispersion', reglages: { taille: 0.32 } },
    0: { type: 'decalage', reglages: {} },
};

// Téléphone : hauteur de la lettre, en part du plus petit côté de la grille.
// En Sligoil, l'encre d'une capitale fait environ 0,65 de cette hauteur en
// largeur (0,8 pour W), soit 40 à 60 % de la largeur de l'écran.
const TAILLE_GRANDE = 0.75;
// Encre de la lettre autour de son centre, en part de sa hauteur (voir glyphes.js)
const ENCRE = { gauche: 0.4, haut: 0.55, bas: 0.42 };

/**
 * Téléphone : une seule grande lettre, posée au hasard là où elle tient
 * en entier dans la grille.
 * @param {string} lettre  minuscule a à z
 * @param {{ cols: number, rows: number }} dim  grille en cellules
 * @param {number} teinte  1 à 6
 * @param {() => number} [rnd]
 * @returns {Note | null}
 */
export function noteGrande(lettre, dim, teinte, rnd = Math.random) {
    if (!/^[a-z]$/.test(lettre)) return null;
    const h = Math.min(dim.cols, dim.rows) * TAILLE_GRANDE;
    /** @param {number} avant @param {number} apres @param {number} cote */
    const placer = (avant, apres, cote) => {
        const libre = 1 - (avant + apres) / cote;
        return libre > 0 ? avant / cote + rnd() * libre : 0.5;
    };
    return {
        type: 'lettre',
        reglages: {
            lettre: lettre.toUpperCase(),
            x: placer(h * ENCRE.gauche, h * ENCRE.gauche, dim.cols),
            y: placer(h * ENCRE.haut, h * ENCRE.bas, dim.rows),
            taille: TAILLE_GRANDE,
            teinte,
            detoure: true,
        },
    };
}

/**
 * Position et teinte d'une lettre, d'après sa place sur le clavier.
 * @param {string} lettre  minuscule a à z
 * @returns {Note | null}
 */
export function noteDeLettre(lettre) {
    const rangee = RANGEES.findIndex((r) => r.includes(lettre));
    if (rangee === -1) return null;
    const colonne = RANGEES[rangee].indexOf(lettre);
    return {
        type: 'lettre',
        reglages: {
            lettre: lettre.toUpperCase(),
            x: (colonne + DECALAGES[rangee] + 0.5) / 10.4,
            y: 0.22 + rangee * 0.28,
            taille: 0.36,
            teinte: ((colonne + rangee * 2) % NB_TEINTES) + 1,
        },
    };
}

/**
 * @param {string} cle  KeyboardEvent.key
 * @returns {Note | 'effacer' | 'composer' | null}
 */
export function noteDeTouche(cle) {
    if (cle === ' ') return 'effacer';
    if (cle === 'Enter') return 'composer';
    const minuscule = cle.toLowerCase();
    if (/^[a-z]$/.test(minuscule)) return noteDeLettre(minuscule);
    return CHIFFRES[cle] ?? null;
}

