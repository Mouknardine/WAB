/**
 * Lecture des jetons de css/jetons.css utiles au dessin du canvas.
 */

const NOMS = ['bleu', 'rose', 'jaune', 'rouge', 'ciel', 'vert'];
const TEINTES = NOMS.map((nom) => `--t-${nom}`);

/**
 * @typedef {Object} Jetons
 * @property {string[]} teintes  aplats, dans l'ordre des valeurs 1 à 6 de la grille
 * @property {string[]} encres  encre lisible sur chaque aplat
 * @property {string[]} isoles  lettre isolée de chaque teinte, sur le papier
 * @property {string} fond
 * @property {string} famille
 * @property {number} cellule  px
 * @property {number} ecriture  px
 */

/**
 * @param {HTMLElement} racine
 * @returns {Jetons}
 */
export function lireJetons(racine) {
    const style = getComputedStyle(racine);
    const lire = (/** @type {string} */ nom) => style.getPropertyValue(nom).trim();
    return {
        teintes: TEINTES.map(lire),
        encres: NOMS.map((nom) => lire(`--sur-${nom}`)),
        isoles: NOMS.map((nom) => lire(`--isole-${nom}`)),
        fond: lire('--fond'),
        famille: lire('--police-machine'),
        cellule: Number(lire('--cellule')) || 14,
        ecriture: Math.max(12, Number(lire('--ecriture')) || 13),
    };
}

/** @returns {boolean} */
export const mouvementReduit = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Téléphone : même seuil que css/mobile.css (moins de 768 px de large).
 * @returns {boolean}
 */
export const petitEcran = () => window.matchMedia('(max-width: 47.99rem)').matches;
