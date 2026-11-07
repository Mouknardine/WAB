/**
 * Lettres en pixels. W, A et B, les lettres du studio, sont dessinées à
 * la main sur une trame de 9 rangées (fûts de 2 cellules, barres d'une)
 * et agrandies d'un nombre entier de fois : elles restent nettes à toute
 * taille. Les autres lettres sont écrites en Sligoil dans un petit canvas
 * (une cellule = un pixel). Tout est gardé en mémoire par taille.
 */

const SEUIL_ENCRE = 110;
const RANGEES_DESSIN = 9;
/** @type {Record<string, string[]>} */
const DESSINS = {
    W: [
        '##....##',
        '##....##',
        '##....##',
        '##....##',
        '##.##.##',
        '##.##.##',
        '##.##.##',
        '########',
        '.##..##.',
    ],
    A: [
        '.####.',
        '##..##',
        '##..##',
        '##..##',
        '######',
        '##..##',
        '##..##',
        '##..##',
        '##..##',
    ],
    B: [
        '#####.',
        '##..##',
        '##..##',
        '##..##',
        '#####.',
        '##..##',
        '##..##',
        '##..##',
        '#####.',
    ],
};

/**
 * Combien de fois agrandir le dessin pour approcher la hauteur voulue.
 * @param {number} hauteur  en cellules
 * @returns {number}
 */
export const facteurDessin = (hauteur) => Math.max(1, Math.floor(hauteur / RANGEES_DESSIN + 0.25));

/**
 * Largeur d'une lettre dessinée, en cellules (0 si elle ne l'est pas).
 * @param {string} lettre @param {number} facteur
 * @returns {number}
 */
export const largeurDessin = (lettre, facteur) => (DESSINS[lettre]?.[0].length ?? 0) * facteur;

/**
 * @param {string[]} dessin @param {number} f  agrandissement
 * @returns {Glyphe}
 */
function depuisDessin(dessin, f) {
    /** @type {Array<[number, number]>} */
    const points = [];
    dessin.forEach((ligne, r) => Array.from(ligne).forEach((signe, c) => {
        if (signe !== '#') return;
        for (let dr = 0; dr < f; dr += 1) for (let dc = 0; dc < f; dc += 1) points.push([c * f + dc, r * f + dr]);
    }));
    return { largeur: dessin[0].length * f, hauteur: dessin.length * f, points };
}

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
    const dessin = DESSINS[lettre];
    if (dessin) {
        const dessinee = depuisDessin(dessin, facteurDessin(hauteur));
        memoire.set(cle, dessinee);
        return dessinee;
    }

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
