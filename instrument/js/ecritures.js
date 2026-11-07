/**
 * Le calque d'écritures : de petits signes et mots en Sligoil semés sur
 * les aplats de la grille, comme sur l'accueil en ligne. Ils naissent là
 * où des cases se remplissent, changent d'encre si la teinte change sous
 * eux, disparaissent si la case se vide. Décoratif (aria-hidden), dessiné
 * dans un canvas posé sur la grille, redessiné seulement quand ça change.
 */

import { naitre, tenue } from './ecritures-place.js';
import { SIGNES, auHasard, enMouvement, texteAffiche } from './signes.js';
import { lireJetons } from './jetons.js';

// Un signe pour ~40 cases pleines : présents sans charger l’écran.
const CASES_PAR_SIGNE = 40;
const CREDIT_MAX = 8;
const ESSAIS = 10;
const PROTECTION = 8000;
const CHANCE_VIVRE = 0.12;
const DPR_MAX = 2;

/**
 * @typedef {import('./signes.js').Signe} Signe
 * @typedef {import('./gestes-dessin.js').Geste} Geste
 * @typedef {{ c0: number, c1: number, r0: number, r1: number, fin: number }} Zone
 * @typedef {Object} Ecritures
 * @property {() => void} mettreAJour  après chaque peinture de la grille
 * @property {(gestes: Geste[]) => void} proteger  écarte les grandes lettres détourées
 * @property {() => void} vivre  appelé par le pilote : quelques signes changent
 */

/**
 * @param {HTMLCanvasElement} toile  calque d'écritures, calé sur la grille
 * @param {import('./instrument.js').Instrument} instrument
 * @param {boolean} fige  mouvement réduit : ni brouillage ni frappe
 * @returns {Ecritures}
 */
export function creerEcritures(toile, instrument, fige) {
    const ctx = toile.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D indisponible');
    let jetons = lireJetons(document.documentElement);
    let cols = 0;
    let apercu = new Uint8Array(0);
    let occupe = new Uint8Array(0);
    /** @type {Set<Signe>} */
    const signes = new Set();
    /** @type {Zone[]} */
    let zones = [];
    let pleines = 0;
    let credit = 0;
    let boucle = 0;
    let avance = 0;

    const police = () => `700 ${jetons.ecriture}px ${jetons.famille}`;
    /** @param {string} mot */
    const casesPour = (mot) => Math.ceil((mot.length * avance + 3) / jetons.cellule);
    /** @param {number} k */
    const protegee = (k) => {
        const c = k % cols;
        const r = Math.floor(k / cols);
        return zones.some((z) => c >= z.c0 && c <= z.c1 && r >= z.r0 && r <= z.r1);
    };
    // Un mot déjà à l'écran n'est pas reposé ailleurs
    const affiches = () => new Set([...signes].map((s) => s.texte));
    const champ = () => ({ cols, rows: apercu.length / Math.max(1, cols), image: apercu, occupe, protegee, casesPour, affiches });

    /** @param {Signe} signe @param {number} valeur */
    const marquer = (signe, valeur) => signe.cellules.forEach((i) => { occupe[i] = valeur; });
    /** @param {Signe} signe */
    const retirer = (signe) => { marquer(signe, 0); signes.delete(signe); };

    /** @param {import('./grille.js').Grille} image */
    function reinitialiser(image) {
        jetons = lireJetons(document.documentElement);
        cols = image.cols;
        apercu = new Uint8Array(image.cellules.length);
        occupe = new Uint8Array(image.cellules.length);
        signes.clear();
        zones = [];
        credit = 0;
        ctx.font = police();
        avance = ctx.measureText('M').width;
    }

    /** @param {number} k @param {number} maintenant @returns {boolean} */
    function faireNaitre(k, maintenant) {
        const signe = naitre(champ(), k);
        if (!signe) return false;
        signe.ne = maintenant;
        signes.add(signe);
        marquer(signe, 1);
        return true;
    }

    function dessiner() {
        const maintenant = performance.now();
        const { cel, ox, oy, largeur, hauteur } = instrument.cadre();
        const dpr = Math.min(DPR_MAX, window.devicePixelRatio || 1);
        if (toile.width !== Math.round(largeur * dpr) || toile.height !== Math.round(hauteur * dpr)) {
            toile.width = Math.round(largeur * dpr);
            toile.height = Math.round(hauteur * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, largeur, hauteur);
        ctx.font = police();
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        let bouge = false;
        for (const signe of signes) {
            const k = signe.cellules[0];
            const largeurCases = signe.cellules.length * cel - 1;
            const x = ox + (k % cols) * cel + (largeurCases - signe.texte.length * avance) / 2;
            const y = oy + Math.floor(k / cols) * cel + (cel - 1) / 2;
            ctx.fillStyle = (signe.isole ? jetons.isoles : jetons.encres)[signe.teinte - 1];
            ctx.fillText(texteAffiche(signe, maintenant, fige), Math.round(x), Math.round(y));
            bouge ||= !fige && enMouvement(signe, maintenant);
        }
        boucle = bouge ? requestAnimationFrame(dessiner) : 0;
    }

    const planifier = () => {
        if (!boucle) boucle = requestAnimationFrame(dessiner);
    };

    /** @param {Geste} geste @returns {Zone} */
    function zoneDe(geste) {
        const { cols: c, rows: r } = instrument.dimensions();
        const h = Math.min(c, r) * (geste.taille ?? 0.4);
        const x = (geste.x ?? 0.5) * c;
        const y = (geste.y ?? 0.5) * r;
        return { c0: Math.floor(x - 0.45 * h), c1: Math.ceil(x + 0.45 * h), r0: Math.floor(y - 0.6 * h), r1: Math.ceil(y + 0.48 * h), fin: performance.now() + PROTECTION };
    }

    return {
        mettreAJour() {
            const image = instrument.image();
            const neuf = image.cols !== cols || image.cellules.length !== apercu.length;
            if (neuf) reinitialiser(image);
            const maintenant = performance.now();
            zones = zones.filter((z) => z.fin > maintenant);
            /** @type {number[]} */
            const nouvelles = [];
            pleines = 0;
            for (let k = 0; k < apercu.length; k += 1) {
                const v = image.cellules[k];
                if (v) pleines += 1;
                if (v === apercu[k]) continue;
                apercu[k] = v;
                if (v) nouvelles.push(k);
            }
            let change = neuf;
            for (const signe of signes) {
                const t = tenue(champ(), signe);
                if (t === signe.teinte) continue;
                change = true;
                if (t) signe.teinte = t;
                else retirer(signe);
            }
            credit = Math.min(credit + nouvelles.length / CASES_PAR_SIGNE, CREDIT_MAX + pleines / CASES_PAR_SIGNE);
            for (let essai = 0; credit >= 1 && nouvelles.length && signes.size < pleines / CASES_PAR_SIGNE && essai < credit * ESSAIS; essai += 1) {
                if (!faireNaitre(auHasard(nouvelles), maintenant)) continue;
                credit -= 1;
                change = true;
            }
            credit = Math.min(credit, CREDIT_MAX);
            if (change) planifier();
        },
        proteger(gestes) {
            const detourees = gestes.filter((g) => g.type === 'lettre' && g.detoure);
            if (!detourees.length) return;
            const image = instrument.image();
            if (image.cols !== cols || image.cellules.length !== apercu.length) reinitialiser(image);
            zones.push(...detourees.map(zoneDe));
            for (const signe of signes) if (signe.cellules.some(protegee)) retirer(signe);
            planifier();
        },
        vivre() {
            if (Math.random() > CHANCE_VIVRE) return;
            const maintenant = performance.now();
            const simples = [...signes].filter((s) => !s.isole && s.texte.length === 1);
            const unSigne = simples.length ? auHasard(simples) : null;
            if (unSigne) {
                unSigne.texte = auHasard(SIGNES);
                unSigne.ne = maintenant;
            }
            // Un écran qui a perdu ses signes en regagne un de temps en temps
            if (signes.size < (pleines / CASES_PAR_SIGNE) * 0.7) {
                for (let essai = 0; essai < ESSAIS; essai += 1) {
                    const k = Math.floor(Math.random() * apercu.length);
                    if (apercu[k] && faireNaitre(k, maintenant)) break;
                }
            }
            planifier();
        },
    };
}
