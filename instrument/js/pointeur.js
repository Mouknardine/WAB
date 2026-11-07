/**
 * Souris et doigt : un clic ou un toucher fait éclore une forme à cet
 * endroit ; glisser en appuyant trace un trait de pixels. Rien ne se
 * passe au simple survol.
 */

import { fabriquer } from './gestes.js';
import { NB_TEINTES } from './grille.js';
import { vibrer } from './toucher.js';

const SEUIL_GLISSER = 6;
const FORMES = ['carre', 'cercle', 'croix'];

/**
 * @typedef {import('./gestes-dessin.js').Geste} Geste
 * @param {HTMLCanvasElement} toile
 * @param {{
 *   jouer: (gestes: Geste[]) => void,
 *   signaler: (geste: Geste) => void,
 *   surprendre: () => void,
 * }} cibles
 */
export function relierPointeur(toile, { jouer, signaler, surprendre }) {
    let appui = false;
    let glisse = false;
    let depart = { x: 0, y: 0 };
    /** @type {[number, number]} */
    let dernier = [0, 0];
    let teinte = 1;
    let touchers = 0;

    /** @param {PointerEvent} e @returns {[number, number]} */
    const relatif = (e) => {
        const cadre = toile.getBoundingClientRect();
        return [(e.clientX - cadre.left) / cadre.width, (e.clientY - cadre.top) / cadre.height];
    };

    toile.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        appui = true;
        glisse = false;
        depart = { x: e.clientX, y: e.clientY };
        dernier = relatif(e);
        teinte = 1 + Math.floor(Math.random() * NB_TEINTES);
        toile.setPointerCapture(e.pointerId);
    });

    toile.addEventListener('pointermove', (e) => {
        if (!appui) return;
        if (!glisse && Math.hypot(e.clientX - depart.x, e.clientY - depart.y) < SEUIL_GLISSER) return;
        glisse = true;
        const point = relatif(e);
        jouer([fabriquer('trait', { points: [dernier, point], teinte }, Math.random, performance.now())]);
        dernier = point;
    });

    const relacher = (/** @type {PointerEvent} */ e) => {
        if (!appui) return;
        appui = false;
        if (glisse || e.type === 'pointercancel') return;
        const [x, y] = relatif(e);
        const forme = FORMES[touchers % FORMES.length];
        touchers += 1;
        const geste = fabriquer('forme', { x, y, forme, taille: 0.08 + Math.random() * 0.08 }, Math.random, performance.now());
        if (e.pointerType !== 'mouse') vibrer();
        jouer([geste]);
        signaler(geste);
        surprendre();
    };

    toile.addEventListener('pointerup', relacher);
    toile.addEventListener('pointercancel', relacher);
}
