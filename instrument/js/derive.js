/**
 * La dérive : quelques pixels bougent à chaque battement, sans geste.
 * Un pixel glisse d'une case, change de teinte, s'éteint, ou un voisin
 * s'allume. Le tirage reste à peu près neutre en densité : c'est le
 * pilote qui la régule, avec ses gestes.
 */

import { NB_TEINTES } from './grille.js';

const VOISINS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const ESSAIS = 12;

/**
 * @typedef {import('./grille.js').Grille} Grille
 */

/**
 * Index d'une cellule pleine tirée au hasard, ou -1.
 * @param {Grille} g
 * @returns {number}
 */
function cellulePleine(g) {
    for (let i = 0; i < ESSAIS; i += 1) {
        const k = Math.floor(Math.random() * g.cellules.length);
        if (g.cellules[k]) return k;
    }
    return -1;
}

/**
 * Voisin direct dans la grille, ou -1 hors des bords.
 * @param {Grille} g
 * @param {number} k
 * @returns {number}
 */
function voisin(g, k) {
    const [dc, dr] = VOISINS[Math.floor(Math.random() * VOISINS.length)];
    const c = (k % g.cols) + dc;
    const r = Math.floor(k / g.cols) + dr;
    if (c < 0 || r < 0 || c >= g.cols || r >= g.rows) return -1;
    return r * g.cols + c;
}

/**
 * Un battement de dérive.
 * @param {Grille} g
 * @param {number} nombre  mutations à tenter
 * @returns {number[]} index des cellules modifiées
 */
export function deriver(g, nombre) {
    /** @type {number[]} */
    const touchees = [];
    for (let i = 0; i < nombre; i += 1) {
        const k = cellulePleine(g);
        if (k === -1) break;
        const v = voisin(g, k);
        const tirage = Math.random();
        if (tirage < 0.45 && v !== -1 && !g.cellules[v]) {
            g.cellules[v] = g.cellules[k];
            g.cellules[k] = 0;
            touchees.push(k, v);
        } else if (tirage < 0.7) {
            g.cellules[k] = (g.cellules[k] % NB_TEINTES) + 1;
            touchees.push(k);
        } else if (tirage < 0.85) {
            g.cellules[k] = 0;
            touchees.push(k);
        } else if (v !== -1 && !g.cellules[v]) {
            g.cellules[v] = g.cellules[k];
            touchees.push(v);
        }
    }
    return touchees;
}
