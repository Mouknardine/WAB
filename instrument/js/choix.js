/**
 * Le choix du pilote : quel geste jouer, selon la densité de l'écran.
 * Trop plein (plus de 46 % de cases) : il éclaircit. Trop vide (moins
 * de 34 %) : il ajoute de la matière, surtout des motifs. Entre les
 * deux : la table entière. Il n'écrit plus WAB : les lettres sont au
 * visiteur et à l'ouverture.
 */

import { fabriquer } from './gestes.js';

// Un écran bien rempli, mais où le fond se voit encore.
export const DENSITE_MIN = 0.34;
export const DENSITE_MAX = 0.46;

/**
 * @typedef {import('./gestes-dessin.js').Geste} Geste
 */

/** @param {readonly string[]} liste @returns {string} */
const auHasard = (liste) => liste[Math.floor(Math.random() * liste.length)];

/**
 * @param {string} type @param {Partial<Geste>} reglages @param {number} t0
 * @returns {Geste}
 */
const geste = (type, reglages, t0) => fabriquer(type, reglages, Math.random, t0);

/**
 * Un motif : une forme ou un aplat posé, aussitôt éclaté en pixels
 * épars, puis recopié en miroir. Donne ces trames symétriques de
 * petits carrés, comme une broderie.
 * @param {number} t0
 * @returns {Geste[]}
 */
function motif(t0) {
    const x = 0.25 + Math.random() * 0.5;
    const y = 0.2 + Math.random() * 0.6;
    const base = Math.random() < 0.5
        ? geste('forme', { x, y, forme: auHasard(['carre', 'cercle', 'croix']), taille: 0.22 + Math.random() * 0.14 }, t0)
        : geste('aplat', { x, y }, t0);
    return [
        base,
        geste('pluie', {}, t0 + 120),
        geste('dispersion', { x, y, taille: 0.45 }, t0 + 300),
        geste('miroir', { axe: Math.random() < 0.75 ? 'v' : 'h' }, t0 + 700),
    ];
}

/** @param {number} t0 @returns {Geste[]} */
const forme = (t0) => [geste('forme', { forme: auHasard(['carre', 'cercle', 'croix']), taille: 0.14 + Math.random() * 0.12 }, t0)];

/** Quand l'écran est trop vide : de la matière. Le motif revient le plus souvent. @type {Array<(t0: number) => Geste[]>} */
const AJOUTS = [
    motif, motif, motif,
    (t0) => forme(t0),
    (t0) => [geste('aplat', {}, t0)],
    (t0) => [geste('pluie', {}, t0)],
];

/** Une explosion : les pixels autour d'un point partent en éclats. @param {number} t0 @returns {Geste[]} */
const explosion = (t0) => [geste('dispersion', { taille: 0.3 + Math.random() * 0.25 }, t0)];

/** Une averse : deux pluies de teintes différentes, l'une après l'autre. @param {number} t0 @returns {Geste[]} */
const averse = (t0) => [geste('pluie', {}, t0), geste('pluie', {}, t0 + 220)];

/** Un miroir, parfois dans les deux sens : une figure à quatre côtés. @param {number} t0 @returns {Geste[]} */
const reflet = (t0) => (Math.random() < 0.4
    ? [geste('miroir', { axe: 'v' }, t0), geste('miroir', { axe: 'h' }, t0 + 320)]
    : [geste('miroir', { axe: Math.random() < 0.6 ? 'v' : 'h' }, t0)]);

/** Le reste du temps : la table entière, riche en pluies, explosions et miroirs. @type {Array<(t0: number) => Geste[]>} */
const TABLE = [
    ...AJOUTS,
    motif,
    averse, averse,
    explosion, explosion, explosion,
    reflet, reflet, reflet,
    (t0) => [geste('vague', {}, t0)],
    (t0) => [geste('decalage', {}, t0)],
];

/**
 * @param {number} densite  part des cases pleines
 * @param {number} t0
 * @returns {Geste[]}
 */
export function choisirGestes(densite, t0) {
    if (densite > DENSITE_MAX) {
        return [geste('eclaircir', { taille: 0.2 + Math.random() * 0.1 }, t0)];
    }
    const table = densite < DENSITE_MIN ? AJOUTS : TABLE;
    return table[Math.floor(Math.random() * table.length)](t0);
}
