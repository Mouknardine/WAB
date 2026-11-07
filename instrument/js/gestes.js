/**
 * Le catalogue des gestes : comment chacun se peint, combien de temps
 * il dure, et comment on le fabrique avec ses réglages tirés au hasard.
 */

import { NB_TEINTES } from './grille.js';
import { lettre, forme, aplat, trait, pluie, vague } from './gestes-dessin.js';
import { miroir, dispersion, decalage } from './gestes-transformation.js';

/**
 * @typedef {import('./gestes-dessin.js').Geste} Geste
 * @typedef {import('./gestes-dessin.js').Contexte} Contexte
 * @typedef {import('./grille.js').Grille} Grille
 * @typedef {(g: Grille, geste: Geste, p: number, ctx: Contexte, tampon: Grille) => void} Peintre
 */

/** @type {Record<string, { duree: number, peindre: Peintre, nom: string }>} */
const CATALOGUE = {
    lettre: { duree: 260, nom: 'lettre', peindre: (g, geste, p, ctx) => lettre(g, geste, p, ctx) },
    forme: { duree: 240, nom: 'forme', peindre: (g, geste, p) => forme(g, geste, p) },
    aplat: { duree: 200, nom: 'aplat', peindre: (g, geste, p) => aplat(g, geste, p) },
    vague: { duree: 360, nom: 'vague', peindre: (g, geste, p) => vague(g, geste, p) },
    pluie: { duree: 380, nom: 'pluie', peindre: (g, geste, p) => pluie(g, geste, p) },
    trait: { duree: 0, nom: 'trait', peindre: (g, geste) => trait(g, geste) },
    miroir: { duree: 300, nom: 'miroir', peindre: (g, geste, p, _c, t) => miroir(g, geste, p, t) },
    dispersion: { duree: 320, nom: 'dispersion', peindre: (g, geste, p, _c, t) => dispersion(g, geste, p, t) },
    eclaircir: { duree: 340, nom: 'éclaircie', peindre: (g, geste, p, _c, t) => dispersion(g, geste, p, t) },
    effacer: { duree: 340, nom: 'effacement', peindre: (g, geste, p, _c, t) => dispersion(g, geste, p, t) },
    decalage: { duree: 220, nom: 'décalage des teintes', peindre: (g, geste, p) => decalage(g, geste, p) },
};

export const NOMS_TEINTES = ['bleu', 'rose', 'jaune', 'rouge', 'ciel', 'vert'];

/**
 * Peint un geste à l'avancement p. Un type inconnu ne peint rien.
 * @param {Grille} g @param {Geste} geste @param {number} p
 * @param {Contexte} ctx @param {Grille} tampon
 */
export function appliquer(g, geste, p, ctx, tampon) {
    CATALOGUE[geste.type]?.peindre(g, geste, p, ctx, tampon);
}

/**
 * @param {Geste} geste
 * @returns {string} description courte pour les lecteurs d'écran
 */
export function decrire(geste) {
    const nom = CATALOGUE[geste.type]?.nom ?? geste.type;
    if (geste.type === 'lettre') return `lettre ${geste.lettre}`;
    if (geste.type === 'forme') return `${geste.forme === 'carre' ? 'carré' : geste.forme} ${NOMS_TEINTES[geste.teinte - 1]}`;
    return nom;
}

/**
 * Fabrique un geste prêt à jouer.
 * @param {string} type
 * @param {Partial<Geste>} reglages  ce qui est imposé (position, lettre, forme…)
 * @param {() => number} rnd
 * @param {number} maintenant
 * @returns {Geste}
 */
export function fabriquer(type, reglages, rnd, maintenant) {
    const duree = CATALOGUE[type]?.duree ?? 0;
    return {
        type,
        t0: maintenant,
        duree,
        graine: Math.floor(rnd() * 1e9),
        teinte: 1 + Math.floor(rnd() * NB_TEINTES),
        x: 0.1 + rnd() * 0.8,
        y: 0.12 + rnd() * 0.76,
        taille: 0.1 + rnd() * 0.14,
        l: 0.15 + rnd() * 0.3,
        h: 0.1 + rnd() * 0.3,
        ...reglages,
    };
}
