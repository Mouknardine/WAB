/**
 * Lettres en pixels : chaque lettre est écrite en Sligoil dans un petit
 * canvas (une cellule = un pixel), puis gardée en mémoire par taille.
 */

const SEUIL_ENCRE = 110;

/**
 * @typedef {Object} Glyphe
 * @property {number} largeur  en cellules
 * @property {number} hauteur
 * @property {Array<[number, number]>} points  cellules pleines [colonne, rangée]
 */

/** @type {Map<string, Glyphe>} */
const memoire = new Map();

/**
 * @param {string} lettre
 * @param {number} hauteur  hauteur de la lettre en cellules
 * @param {string} famille  pile de polices CSS
 * @returns {Glyphe}
 */
export function glyphe(lettre, hauteur, famille) {
    const cle = `${lettre}|${hauteur}|${famille}`;
    const connu = memoire.get(cle);
    if (connu) return connu;

    const toile = document.createElement('canvas');
    const taille = Math.max(6, Math.round(hauteur * 1.3));
    toile.width = taille;
    toile.height = taille;
    const ctx = toile.getContext('2d', { willReadFrequently: true });
    /** @type {Glyphe} */
    const vide = { largeur: 0, hauteur: 0, points: [] };
    if (!ctx) return vide;

    ctx.font = `700 ${taille}px ${famille}`;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText(lettre, taille / 2, Math.round(taille * 0.8));

    const { data } = ctx.getImageData(0, 0, taille, taille);
    /** @type {Array<[number, number]>} */
    const points = [];
    for (let r = 0; r < taille; r += 1) {
        for (let c = 0; c < taille; c += 1) {
            if (data[(r * taille + c) * 4 + 3] >= SEUIL_ENCRE) points.push([c, r]);
        }
    }
    const resultat = { largeur: taille, hauteur: taille, points };
    memoire.set(cle, resultat);
    return resultat;
}
