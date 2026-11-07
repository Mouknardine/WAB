/**
 * La grille de l'instrument : un tableau de cellules, chacune vide (0)
 * ou peinte d'une des six teintes (1 à 6). Aucune dépendance au canvas.
 */

export const NB_TEINTES = 6;

/**
 * @typedef {Object} Grille
 * @property {number} cols
 * @property {number} rows
 * @property {Uint8Array} cellules
 */

/**
 * @param {number} cols
 * @param {number} rows
 * @returns {Grille}
 */
export function creerGrille(cols, rows) {
    return { cols, rows, cellules: new Uint8Array(cols * rows) };
}

/**
 * @param {Grille} source
 * @param {Grille} cible
 */
export function copierDans(source, cible) {
    cible.cellules.set(source.cellules);
}

/**
 * @param {Grille} g
 * @param {number} c
 * @param {number} r
 * @param {number} teinte 0 pour effacer
 */
export function peindre(g, c, r, teinte) {
    const ci = Math.round(c);
    const ri = Math.round(r);
    if (ci < 0 || ri < 0 || ci >= g.cols || ri >= g.rows) return;
    g.cellules[ri * g.cols + ci] = teinte;
}

/**
 * @param {Grille} g
 * @param {number} c
 * @param {number} r
 * @returns {number}
 */
export function lire(g, c, r) {
    if (c < 0 || r < 0 || c >= g.cols || r >= g.rows) return 0;
    return g.cellules[r * g.cols + c];
}

/**
 * Nombre pseudo-aléatoire stable entre 0 et 1 pour une cellule et une
 * graine : un geste rejoué donne exactement la même image.
 * @param {number} a
 * @param {number} b
 * @param {number} graine
 * @returns {number}
 */
export function bruit(a, b, graine) {
    let h = Math.imul(a + 374761393, 668265263) ^ Math.imul(b + 1442695041, 2246822519) ^ graine;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
}

/**
 * Générateur pseudo-aléatoire à graine (mulberry32).
 * @param {number} graine
 * @returns {() => number}
 */
export function hasard(graine) {
    let s = graine >>> 0;
    return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Décélération, équivalent de cubic-bezier(0.23, 1, 0.32, 1).
 * @param {number} t
 * @returns {number}
 */
export const decelerer = (t) => 1 - (1 - t) ** 5;
