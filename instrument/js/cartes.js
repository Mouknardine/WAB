/**
 * Les cartes posées sur l'instrument : Nous, Projets, Prix, Contact.
 * Chaque rubrique ouverte est un paquet : une carte visible à la fois,
 * ← → pour passer à la suivante (et les flèches du clavier, ou un glisser
 * horizontal au doigt), × ou Échap pour le fermer. Au bureau, plusieurs
 * paquets peuvent être ouverts ; sur téléphone, un seul, qui couvre la
 * zone de l'instrument.
 * Ouvrir ou fermer se fait d'un coup ; passer d'une carte à l'autre
 * glisse en douceur (js/cartes-transition.js).
 */

import { RUBRIQUES } from './cartes-donnees.js';
import { remplirRubrique } from './cartes-rendu.js';
import { auPremierPlan, rang, placerPaquet, garderDansZone, rendreDeplacable } from './cartes-bureau.js';
import { petitEcran } from './jetons.js';
import { relierGlisser } from './cartes-glisser.js';
import { creerNav, creerIndice } from './cartes-nav.js';
import { passerCarte } from './cartes-transition.js';

/**
 * @typedef {Object} Paquet
 * @property {string} id
 * @property {HTMLElement} region
 * @property {HTMLButtonElement} bouton
 * @property {HTMLElement[]} cartes
 * @property {number} courante
 * @property {import('./cartes-nav.js').Nav | null} nav  navigation au pouce (téléphone)
 * @property {() => void} indice  « Glissez pour la suite », une fois par visite
 * @typedef {{ ouvrir: (id: string, options?: { focus?: boolean }) => void }} Cartes
 */

/** Souris ou clavier : le contour de focus n'est montré qu'au clavier. */
function suivreModalite() {
    const racine = document.documentElement;
    document.addEventListener('pointerdown', () => { racine.dataset.modalite = 'souris'; }, true);
    document.addEventListener('keydown', () => { racine.dataset.modalite = 'clavier'; }, true);
}

/**
 * @param {HTMLElement} calque  conteneur des régions (#cartes)
 * @returns {Cartes}
 */
export function creerCartes(calque) {
    /** @type {Paquet[]} */
    const paquets = [];
    for (const rubrique of RUBRIQUES) {
        const region = calque.querySelector(`#rubrique-${rubrique.id}`);
        const bouton = document.querySelector(`[aria-controls="rubrique-${rubrique.id}"]`);
        if (!(region instanceof HTMLElement) || !(bouton instanceof HTMLButtonElement)) continue;
        const cartes = remplirRubrique(region, rubrique);
        region.toggleAttribute('data-paquet', cartes.length > 1);
        /** @type {Paquet} */
        const p = { id: rubrique.id, region, bouton, cartes, courante: 0, nav: null, indice: () => {} };
        if (cartes.length > 1) {
            p.nav = creerNav(region, cartes.length, (i) => changer(p, i - p.courante, 'carte'), (sens) => changer(p, sens, 'carte'));
            p.indice = creerIndice(region);
        }
        paquets.push(p);
        rendreDeplacable(region, () => !petitEcran());
    }
    suivreModalite();

    const ouverts = () => paquets.filter((p) => !p.region.hidden);
    const devant = () => ouverts().reduce((/** @type {Paquet | null} */ a, p) => (!a || rang(p.region) > rang(a.region) ? p : a), null);

    /** Seule la carte courante est montrée. @param {Paquet} p */
    function afficher(p) {
        p.cartes.forEach((c, i) => { c.hidden = i !== p.courante; });
        p.nav?.maj(p.courante);
    }


    /** @param {Paquet} p @param {boolean} rendreFocus */
    function fermer(p, rendreFocus) {
        p.region.hidden = true;
        p.bouton.setAttribute('aria-expanded', 'false');
        if (rendreFocus) p.bouton.focus();
    }

    /**
     * Passe à la carte voisine ; le focus suit (sur le même bouton ← → ou sur la carte).
     * @param {Paquet} p @param {number} sens @param {'carte' | 'bouton' | null} focus
     */
    function changer(p, sens, focus) {
        const avant = p.cartes[p.courante];
        const hauteurAvant = avant.offsetHeight;
        p.courante = (p.courante + sens + p.cartes.length) % p.cartes.length;
        afficher(p);
        p.region.querySelectorAll('.paquet__indice').forEach((i) => { i.hidden = true; });
        garderDansZone(p.region);
        const carte = p.cartes[p.courante];
        if (carte !== avant) passerCarte(avant, carte, sens, hauteurAvant);
        const cible = focus === 'bouton' ? carte.querySelector(`.carte__nav[data-sens="${sens}"]`) : carte;
        if (focus && cible instanceof HTMLElement) cible.focus({ preventScroll: true });
    }

    /** @param {string} id @param {{ focus?: boolean }} [options] */
    function ouvrir(id, { focus = true } = {}) {
        const p = paquets.find((q) => q.id === id);
        if (!p) return;
        const mobile = petitEcran();
        const precedent = devant();
        if (mobile) ouverts().filter((q) => q !== p).forEach((q) => fermer(q, false));
        const etaitFerme = p.region.hidden;
        p.region.hidden = false;
        p.bouton.setAttribute('aria-expanded', 'true');
        afficher(p);
        if (mobile) {
            p.cartes[p.courante].scrollTop = 0;
            p.nav?.ajuster();
            p.indice();
        } else if (etaitFerme) placerPaquet(p.region, precedent && precedent !== p ? precedent.region : null);
        else auPremierPlan(p.region);
        if (focus) p.cartes.find((c) => !c.hidden)?.focus({ preventScroll: true });
    }

    for (const p of paquets) {
        p.bouton.addEventListener('click', () => ouvrir(p.id));
        p.region.addEventListener('pointerdown', () => { if (!petitEcran()) auPremierPlan(p.region); });
        p.region.addEventListener('click', (e) => {
            if (!(e.target instanceof Element)) return;
            const nav = e.target.closest('.carte__nav');
            if (nav instanceof HTMLElement) return changer(p, Number(nav.dataset.sens), 'bouton');
            if (e.target.closest('.carte__fermer')) fermer(p, true);
        });
        relierGlisser(p.region, (sens) => { if (p.cartes.length > 1) changer(p, sens, 'carte'); });
        p.region.addEventListener('keydown', (e) => {
            if (p.cartes.length < 2 || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
            e.preventDefault();
            changer(p, e.key === 'ArrowLeft' ? -1 : 1, 'carte');
        });
    }

    document.addEventListener('keydown', (e) => {
        const p = e.key === 'Escape' ? devant() : null;
        if (!p) return;
        e.preventDefault();
        fermer(p, p.region.contains(document.activeElement));
    });

    // Passage bureau ↔ téléphone : une seule rubrique gardée sur téléphone,
    // les paquets reposés au retour sur le bureau.
    window.matchMedia('(max-width: 47.99rem)').addEventListener('change', () => {
        const liste = ouverts().sort((a, b) => rang(a.region) - rang(b.region));
        if (petitEcran()) liste.slice(0, -1).forEach((p) => fermer(p, false));
        let precedent = null;
        for (const p of ouverts()) {
            afficher(p);
            if (!petitEcran()) placerPaquet(p.region, precedent);
            precedent = p.region;
        }
    });
    return { ouvrir };
}
