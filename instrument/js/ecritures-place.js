/**
 * Où naît une écriture : sur une case pleine, assez loin des autres
 * signes pour que l'ensemble reste aéré, jamais dans une zone protégée
 * (grande lettre fraîchement posée). Un mot ne tient que sur une suite
 * de cases de la même teinte, dans la même rangée : il ne déborde jamais
 * de son aplat.
 */

import { SIGNES, LETTRES, auHasard, motsPour } from './signes.js';

const CHANCE_MOT = 0.4;
const CHANCE_ISOLE = 0.05;

/**
 * @typedef {import('./signes.js').Signe} Signe
 * @typedef {Object} Champ
 * @property {number} cols
 * @property {number} rows
 * @property {Uint8Array} image  teinte de chaque case (0 = papier)
 * @property {Uint8Array} occupe  1 si un signe est posé sur la case
 * @property {(k: number) => boolean} protegee
 * @property {(mot: string) => number} casesPour  cases nécessaires à un mot
 * @property {() => Set<string>} affiches  textes déjà à l'écran
 */

/**
 * La case et ses huit voisines sont libres de tout signe, et la case
 * n'est pas protégée.
 * @param {Champ} champ @param {number} k
 */
function libre(champ, k) {
    if (champ.protegee(k)) return false;
    const c = k % champ.cols;
    const r = Math.floor(k / champ.cols);
    for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
            const cc = c + dc;
            const rr = r + dr;
            if (cc < 0 || rr < 0 || cc >= champ.cols || rr >= champ.rows) continue;
            if (champ.occupe[rr * champ.cols + cc]) return false;
        }
    }
    return true;
}

/**
 * Une suite de `n` cases de la teinte `t`, sur la rangée de k, qui
 * contient k ; null si elle n'existe pas.
 * @param {Champ} champ @param {number} k @param {number} n @param {number} t
 * @returns {number[] | null}
 */
function suite(champ, k, n, t) {
    const c = k % champ.cols;
    const debut = Math.max(0, c - Math.floor(Math.random() * n));
    if (debut + n > champ.cols) return null;
    const ligne = k - c;
    const cases = Array.from({ length: n }, (_, i) => ligne + debut + i);
    return cases.every((i) => champ.image[i] === t && libre(champ, i)) ? cases : null;
}

/**
 * Une lettre isolée sur le papier, à une ou deux cases de l'aplat.
 * @param {Champ} champ @param {number} k @param {number} t
 * @returns {Signe | null}
 */
function isole(champ, k, t) {
    const c = k % champ.cols + Math.round((Math.random() * 2 - 1) * 2);
    const r = Math.floor(k / champ.cols) + Math.round((Math.random() * 2 - 1) * 2);
    if (c < 0 || r < 0 || c >= champ.cols || r >= champ.rows) return null;
    const i = r * champ.cols + c;
    if (champ.image[i] !== 0 || !libre(champ, i)) return null;
    return { cellules: [i], texte: auHasard(LETTRES), teinte: t, isole: true, ne: 0 };
}

/**
 * Tente de faire naître une écriture à partir de la case k.
 * @param {Champ} champ @param {number} k
 * @returns {Signe | null}
 */
export function naitre(champ, k) {
    const t = champ.image[k];
    if (!t) return null;
    const tirage = Math.random();
    if (tirage < CHANCE_ISOLE) return isole(champ, k, t);
    if (!libre(champ, k)) return null;
    if (tirage < CHANCE_ISOLE + CHANCE_MOT) {
        const deja = champ.affiches();
        const mot = auHasard(motsPour(8, champ.casesPour).filter((m) => !deja.has(m)));
        const cases = mot ? suite(champ, k, champ.casesPour(mot), t) : null;
        if (mot && cases) return { cellules: cases, texte: mot, teinte: t, isole: false, ne: 0 };
    }
    return { cellules: [k], texte: auHasard(SIGNES), teinte: t, isole: false, ne: 0 };
}

/**
 * Le signe tient-il encore ? Renvoie sa teinte actuelle (elle peut avoir
 * changé sous lui : il change alors d'encre), ou 0 s'il doit disparaître
 * (case vidée, aplat coupé en deux teintes, isolé recouvert).
 * @param {Champ} champ @param {Signe} signe
 * @returns {number}
 */
export function tenue(champ, signe) {
    if (signe.isole) return champ.image[signe.cellules[0]] === 0 ? signe.teinte : 0;
    const t = champ.image[signe.cellules[0]];
    return t && signe.cellules.every((i) => champ.image[i] === t) ? t : 0;
}
