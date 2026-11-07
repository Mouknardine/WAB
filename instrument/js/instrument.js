/**
 * Le moteur de l'instrument : garde l'image jouée, superpose les gestes
 * en cours, et peint le tout dans le canvas. Les valeurs (teintes,
 * cellule) sont lues dans css/jetons.css.
 */

import { creerGrille, copierDans } from './grille.js';
import { appliquer } from './gestes.js';
import { lireJetons, mouvementReduit } from './jetons.js';

const DPR_MAX = 2;
const HISTORIQUE_MAX = 4000;

/**
 * @typedef {import('./gestes-dessin.js').Geste} Geste
 * @typedef {Object} Instrument
 * @property {(gestes: Geste[]) => void} jouer  gestes animés
 * @property {(gestes: Geste[]) => void} poser  gestes posés d'un coup
 * @property {() => void} vider
 * @property {() => number} densite  part des cellules pleines (0 à 1)
 * @property {() => { cols: number, rows: number }} dimensions
 * @property {(muter: (g: import('./grille.js').Grille) => number[]) => void} deriver
 *   modifie l'image jouée et ne repeint que les cellules touchées
 * @property {() => import('./grille.js').Grille} image  l'image affichée
 * @property {() => Cadre} cadre  placement de la grille dans le canvas
 * @typedef {{ cel: number, ox: number, oy: number, largeur: number, hauteur: number }} Cadre
 * @typedef {{ apresPeinture?: () => void, surGestes?: (gestes: Geste[]) => void }} Ecouteurs
 *   prévenus après chaque peinture et à chaque geste joué ou posé (calque d'écritures)
 */

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Ecouteurs} [ecouteurs]
 * @returns {Instrument}
 */
export function creerInstrument(canvas, ecouteurs = {}) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D indisponible');

    let jetons = lireJetons(document.documentElement);
    let base = creerGrille(1, 1);
    let image = creerGrille(1, 1);
    let tampon = creerGrille(1, 1);
    /** @type {Geste[]} */
    let enCours = [];
    /** @type {Geste[]} */
    let historique = [];
    let boucle = 0;

    const contexte = () => ({ famille: jetons.famille });

    /** @param {Geste} geste @param {number} maintenant */
    const avancement = (geste, maintenant) =>
        geste.duree > 0 ? Math.min(1, (maintenant - geste.t0) / geste.duree) : 1;

    /** @param {Geste} geste */
    function fixer(geste) {
        appliquer(base, geste, 1, contexte(), tampon);
        if (geste.type === 'effacer') historique = [];
        else historique.push(geste);
        if (historique.length > HISTORIQUE_MAX) historique.shift();
    }

    /** @returns {Cadre} */
    function cadre() {
        const { width, height } = canvas.getBoundingClientRect();
        const cel = jetons.cellule;
        return { cel, ox: (width - image.cols * cel) / 2, oy: (height - image.rows * cel) / 2, largeur: width, hauteur: height };
    }

    function peindre() {
        const { cel, ox, oy, largeur, hauteur } = cadre();
        const cote = cel - 1;
        ctx.fillStyle = jetons.fond;
        ctx.fillRect(0, 0, largeur, hauteur);
        jetons.teintes.forEach((teinte, i) => {
            ctx.fillStyle = teinte;
            const valeur = i + 1;
            for (let k = 0; k < image.cellules.length; k += 1) {
                if (image.cellules[k] !== valeur) continue;
                ctx.fillRect(ox + (k % image.cols) * cel, oy + Math.floor(k / image.cols) * cel, cote, cote);
            }
        });
        ecouteurs.apresPeinture?.();
    }

    /** @param {number[]} indices */
    function peindreCellules(indices) {
        const { cel, ox, oy } = cadre();
        for (const k of indices) {
            const x = ox + (k % image.cols) * cel;
            const y = oy + Math.floor(k / image.cols) * cel;
            ctx.fillStyle = jetons.fond;
            ctx.fillRect(x, y, cel, cel);
            const teinte = image.cellules[k];
            if (!teinte) continue;
            ctx.fillStyle = jetons.teintes[teinte - 1];
            ctx.fillRect(x, y, cel - 1, cel - 1);
        }
        ecouteurs.apresPeinture?.();
    }

    function composerImage() {
        const maintenant = performance.now();
        while (enCours.length && avancement(enCours[0], maintenant) >= 1) {
            fixer(/** @type {Geste} */ (enCours.shift()));
        }
        copierDans(base, image);
        for (const geste of enCours) {
            const p = avancement(geste, maintenant);
            if (p > 0) appliquer(image, geste, p, contexte(), tampon);
        }
        peindre();
    }

    function tourner() {
        composerImage();
        boucle = enCours.length ? requestAnimationFrame(tourner) : 0;
    }

    function dimensionner() {
        jetons = lireJetons(document.documentElement);
        const { width, height } = canvas.getBoundingClientRect();
        const dpr = Math.min(DPR_MAX, window.devicePixelRatio || 1);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const cols = Math.max(4, Math.floor(width / jetons.cellule));
        const rows = Math.max(4, Math.floor(height / jetons.cellule));
        base = creerGrille(cols, rows);
        image = creerGrille(cols, rows);
        tampon = creerGrille(cols, rows);
        const rejouer = historique;
        historique = [];
        rejouer.forEach(fixer);
    }

    let attente = 0;
    new ResizeObserver(() => {
        window.clearTimeout(attente);
        attente = window.setTimeout(() => {
            dimensionner();
            composerImage();
        }, 100);
    }).observe(canvas);
    dimensionner();

    return {
        jouer(gestes) {
            const immediat = mouvementReduit();
            const maintenant = performance.now();
            ecouteurs.surGestes?.(gestes);
            for (const geste of gestes) {
                if (immediat) {
                    geste.duree = 0;
                    geste.t0 = maintenant;
                }
                enCours.push(geste);
            }
            if (!boucle) boucle = requestAnimationFrame(tourner);
        },
        poser(gestes) {
            ecouteurs.surGestes?.(gestes);
            gestes.forEach(fixer);
            composerImage();
        },
        densite() {
            let pleines = 0;
            for (const v of base.cellules) if (v) pleines += 1;
            return pleines / base.cellules.length;
        },
        dimensions() {
            return { cols: base.cols, rows: base.rows };
        },
        image: () => image,
        cadre,
        deriver(muter) {
            const indices = muter(base);
            if (boucle) return;
            for (const k of indices) image.cellules[k] = base.cellules[k];
            peindreCellules(indices);
        },
        vider() {
            enCours = [];
            historique = [];
            base.cellules.fill(0);
            composerImage();
        },
    };
}
