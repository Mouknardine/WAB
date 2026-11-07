/**
 * Gestes qui ajoutent des pixels : lettre, forme, aplat, trait.
 * Chaque geste peint l'état atteint à l'avancement p (0 à 1) ; le même p
 * donne toujours la même image, donc un geste peut être rejoué.
 */

import { peindre, lire, bruit, decelerer } from './grille.js';
import { glyphe } from './glyphes.js';

/**
 * @typedef {import('./grille.js').Grille} Grille
 * @typedef {Object} Geste
 * @property {string} type
 * @property {number} t0
 * @property {number} duree
 * @property {number} graine
 * @property {number} teinte  1 à 6
 * @property {number} [x]  position relative (0 à 1)
 * @property {number} [y]
 * @property {number} [taille]  relative au plus petit côté de la grille
 * @property {number} [l]  largeur relative (aplat)
 * @property {number} [h]  hauteur relative (aplat)
 * @property {string} [lettre]
 * @property {boolean} [detoure]  la lettre vide d'abord son rectangle (téléphone)
 * @property {boolean} [contraste]  chaque pixel de la lettre prend la teinte opposée à celle dessous
 * @property {string} [forme]  carre, cercle ou croix
 * @property {number} [amplitude]  vague : hauteur des ondes, relative à la grille
 * @property {number} [periodes]  vague : nombre d'ondes sur la largeur
 * @property {string} [axe]  v ou h
 * @property {Array<[number, number]>} [points]  tracé relatif
 * @typedef {{ famille: string }} Contexte
 */

/**
 * Vide le rectangle d'encre de la lettre, une cellule de marge autour,
 * jusqu'à la rangée atteinte : la lettre se lit sur du papier.
 * @param {Grille} g @param {Array<[number, number]>} points
 * @param {number} ox @param {number} oy @param {number} limite
 */
function detourer(g, points, ox, oy, limite) {
    if (!points.length) return;
    const cs = points.map(([c]) => c);
    const rs = points.map(([, r]) => r);
    const haut = Math.min(...rs) - 1;
    const bas = Math.min(Math.max(...rs) + 1, limite + 1);
    for (let r = haut; r <= bas; r += 1) {
        for (let c = Math.min(...cs) - 1; c <= Math.max(...cs) + 1; c += 1) peindre(g, ox + c, oy + r, 0);
    }
}

/**
 * Teinte opposée en clarté : sur les teintes sombres (bleu, rouge), la
 * lettre est jaune ; sur les claires (rose, jaune, ciel, vert), bleue.
 * Deux encres seulement : la lettre se lit d'un bloc, quelles que soient
 * les bandes qu'elle traverse (index = teinte, 0 = vide).
 */
const OPPOSEE = [0, 3, 1, 1, 3, 1, 1];

/**
 * La lettre se pose en balayant de haut en bas.
 * @param {Grille} g @param {Geste} geste @param {number} p @param {Contexte} ctx
 */
export function lettre(g, geste, p, ctx) {
    const hauteur = Math.round(Math.min(g.cols, g.rows) * (geste.taille ?? 0.4));
    const gl = glyphe(geste.lettre ?? 'W', hauteur, ctx.famille);
    const ox = Math.round((geste.x ?? 0.5) * g.cols - gl.largeur / 2);
    const oy = Math.round((geste.y ?? 0.5) * g.rows - gl.hauteur / 2);
    const limite = decelerer(p) * gl.hauteur;
    if (geste.detoure) detourer(g, gl.points, ox, oy, limite);
    for (const [c, r] of gl.points) {
        if (r > limite) continue;
        const dessous = geste.contraste ? lire(g, ox + c, oy + r) : 0;
        peindre(g, ox + c, oy + r, dessous ? OPPOSEE[dessous] : geste.teinte);
    }
}

/**
 * Carré plein, anneau ou croix qui éclot depuis son centre.
 * @param {Grille} g @param {Geste} geste @param {number} p
 */
export function forme(g, geste, p) {
    const rayon = Math.min(g.cols, g.rows) * (geste.taille ?? 0.2) * decelerer(p);
    const cx = (geste.x ?? 0.5) * g.cols;
    const cy = (geste.y ?? 0.5) * g.rows;
    const epaisseur = Math.max(2, rayon * 0.28);
    const n = Math.ceil(rayon);
    for (let dy = -n; dy <= n; dy += 1) {
        for (let dx = -n; dx <= n; dx += 1) {
            const d = Math.hypot(dx, dy);
            const dedans = geste.forme === 'cercle'
                ? d <= rayon && d >= rayon - epaisseur
                : geste.forme === 'croix'
                    ? Math.abs(dx) <= epaisseur / 2 || Math.abs(dy) <= epaisseur / 2
                    : true;
            if (dedans) peindre(g, cx + dx, cy + dy, geste.teinte);
        }
    }
}

/**
 * Aplat rectangulaire qui tombe de gauche à droite.
 * @param {Grille} g @param {Geste} geste @param {number} p
 */
export function aplat(g, geste, p) {
    const x0 = Math.round((geste.x ?? 0) * g.cols);
    const y0 = Math.round((geste.y ?? 0) * g.rows);
    const largeur = Math.round((geste.l ?? 0.3) * g.cols);
    const hauteur = Math.round((geste.h ?? 0.2) * g.rows);
    const fin = x0 + Math.round(largeur * decelerer(p));
    for (let c = x0; c < fin; c += 1) {
        for (let r = y0; r < y0 + hauteur; r += 1) peindre(g, c, r, geste.teinte);
    }
}

/**
 * Trait dessiné au doigt ou à la souris, pinceau de deux cellules.
 * @param {Grille} g @param {Geste} geste
 */
export function trait(g, geste) {
    const points = geste.points ?? [];
    for (let i = 0; i < points.length; i += 1) {
        const [ax, ay] = points[Math.max(0, i - 1)];
        const [bx, by] = points[i];
        const pas = Math.max(1, Math.ceil(Math.hypot((bx - ax) * g.cols, (by - ay) * g.rows)));
        for (let k = 0; k <= pas; k += 1) {
            const c = Math.floor((ax + ((bx - ax) * k) / pas) * g.cols);
            const r = Math.floor((ay + ((by - ay) * k) / pas) * g.rows);
            peindre(g, c, r, geste.teinte);
            peindre(g, c + 1, r, geste.teinte);
            peindre(g, c, r + 1, geste.teinte);
            peindre(g, c + 1, r + 1, geste.teinte);
        }
    }
}

/**
 * Pluie : des colonnes tombent, chacune à sa vitesse, en pointillé.
 * @param {Grille} g @param {Geste} geste @param {number} p
 */
export function pluie(g, geste, p) {
    for (let c = 0; c < g.cols; c += 1) {
        if (bruit(c, 0, geste.graine) > 0.12) continue;
        const vitesse = 0.3 + bruit(c, 1, geste.graine) * 0.6;
        const longueur = decelerer(p) * vitesse * g.rows;
        for (let r = 0; r < longueur; r += 1) {
            if (bruit(c, r, geste.graine + 7) < 0.7) peindre(g, c, r, geste.teinte);
        }
    }
}

/**
 * Vague : une bande sinusoïdale traverse l'écran de gauche à droite.
 * @param {Grille} g @param {Geste} geste @param {number} p
 */
export function vague(g, geste, p) {
    const fin = decelerer(p) * g.cols;
    const centre = (geste.y ?? 0.5) * g.rows;
    const amplitude = g.rows * (geste.amplitude ?? 0.18);
    const periodes = geste.periodes ?? 1.5 + bruit(1, 1, geste.graine) * 1.5;
    const frequence = (Math.PI * 2 * periodes) / g.cols;
    const epaisseur = Math.max(3, g.rows * 0.07);
    for (let c = 0; c < fin; c += 1) {
        const milieu = centre + Math.sin(c * frequence + geste.graine) * amplitude;
        for (let r = Math.floor(milieu - epaisseur); r <= milieu + epaisseur; r += 1) {
            peindre(g, c, r, geste.teinte);
        }
    }
}
