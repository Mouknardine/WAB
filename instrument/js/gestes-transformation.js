/**
 * Gestes qui transforment ce qui est déjà joué : miroir, dispersion,
 * décalage des teintes, effacement. Ils lisent l'image d'avant dans un
 * tampon, puis réécrivent la grille à l'avancement p.
 */

import { peindre, lire, bruit, decelerer, copierDans, NB_TEINTES } from './grille.js';

/**
 * @typedef {import('./grille.js').Grille} Grille
 * @typedef {import('./gestes-dessin.js').Geste} Geste
 */

/**
 * Miroir : la moitié gauche (ou haute) se recopie en face, du centre
 * vers le bord.
 * @param {Grille} g @param {Geste} geste @param {number} p @param {Grille} tampon
 */
export function miroir(g, geste, p, tampon) {
    copierDans(g, tampon);
    const vertical = geste.axe !== 'h';
    const moitie = vertical ? Math.floor(g.cols / 2) : Math.floor(g.rows / 2);
    const portee = Math.ceil(decelerer(p) * moitie);
    for (let k = 0; k < portee; k += 1) {
        const source = moitie - 1 - k;
        const cible = vertical ? g.cols - 1 - source : g.rows - 1 - source;
        const longueur = vertical ? g.rows : g.cols;
        for (let i = 0; i < longueur; i += 1) {
            const teinte = vertical ? lire(tampon, source, i) : lire(tampon, i, source);
            if (vertical) peindre(g, cible, i, teinte);
            else peindre(g, i, cible, teinte);
        }
    }
}

/**
 * Dispersion : les pixels autour d'un point s'écartent de lui.
 * Effacement : tout part hors de l'écran. Éclaircie : seuls les pixels
 * autour du point partent, et disparaissent à l'arrivée.
 * @param {Grille} g @param {Geste} geste @param {number} p @param {Grille} tampon
 */
export function dispersion(g, geste, p, tampon) {
    copierDans(g, tampon);
    const cx = (geste.x ?? 0.5) * g.cols;
    const cy = (geste.y ?? 0.5) * g.rows;
    const rayon = Math.min(g.cols, g.rows) * (geste.taille ?? 0.3);
    const total = geste.type === 'effacer';
    const disparait = total || geste.type === 'eclaircir';
    const e = decelerer(p);
    /** @type {Array<[number, number, number]>} */
    const arrivees = [];
    for (let r = 0; r < g.rows; r += 1) {
        for (let c = 0; c < g.cols; c += 1) {
            const teinte = lire(tampon, c, r);
            if (!teinte) continue;
            const d = Math.hypot(c - cx, r - cy) || 1;
            if (!total && d > rayon) continue;
            const force = total
                ? Math.max(g.cols, g.rows) * (0.2 + bruit(c, r, geste.graine) * 0.7)
                : rayon * (0.5 + bruit(c, r, geste.graine));
            peindre(g, c, r, 0);
            if (disparait && p >= 1) continue;
            arrivees.push([c + ((c - cx) / d) * force * e, r + ((r - cy) / d) * force * e, teinte]);
        }
    }
    for (const [c, r, teinte] of arrivees) peindre(g, c, r, teinte);
}

/**
 * Décalage des teintes : chaque pixel passe à la teinte suivante,
 * dans un ordre tiré au hasard.
 * @param {Grille} g @param {Geste} geste @param {number} p
 */
export function decalage(g, geste, p) {
    for (let r = 0; r < g.rows; r += 1) {
        for (let c = 0; c < g.cols; c += 1) {
            const teinte = lire(g, c, r);
            if (!teinte || bruit(c, r, geste.graine) > p) continue;
            peindre(g, c, r, (teinte % NB_TEINTES) + 1);
        }
    }
}
