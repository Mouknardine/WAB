/**
 * Les paquets de cartes au bureau : un par rubrique, posé dans une place
 * libre (les suivants en cascade légère depuis le dernier ouvert, jamais
 * penchés), passé au premier plan au moindre appui, déplaçable par
 * l'en-tête de sa carte. Rien ici ne s'applique au téléphone (carrousel).
 */

import { placeLibre, zoneJeu, toucheUnBord } from './zones.js';

const CASCADE = { x: 40, y: 48 };
// Le paquet évite d'abord le contact et les textes, puis les autres paquets
const POIDS = { bord: 200, carte: 30 };
const MARGE = 16;
// Les bords décalés du paquet (2 × 6 px) font partie de sa taille
const BORDS_PAQUET = 12;
// Un paquet déplacé garde toujours un bout d'en-tête à portée du pointeur
const PRISE = 88;

let plan = 0;

/** @param {HTMLElement} el */
export function auPremierPlan(el) {
    plan += 1;
    el.style.zIndex = String(plan);
}

/** @param {HTMLElement} el @returns {number} */
export const rang = (el) => Number(el.style.zIndex || 0);

/** @param {HTMLElement} el @returns {{ x: number, y: number }} */
function position(el) {
    const style = getComputedStyle(el);
    return { x: parseFloat(style.getPropertyValue('--x')) || 0, y: parseFloat(style.getPropertyValue('--y')) || 0 };
}

/** @param {HTMLElement} el @param {number} x @param {number} y */
function poser(el, x, y) {
    el.style.setProperty('--x', `${Math.round(x)}px`);
    el.style.setProperty('--y', `${Math.round(y)}px`);
}

/**
 * Ramène le paquet dans l'écran (après un changement de carte plus haute).
 * @param {HTMLElement} paquet
 */
export function garderDansZone(paquet) {
    const zone = zoneJeu();
    const { width, height } = paquet.getBoundingClientRect();
    const { x, y } = position(paquet);
    const nx = Math.min(Math.max(PRISE - width, x), zone.largeur - PRISE);
    const ny = Math.max(0, Math.min(y, zone.hauteur - height - BORDS_PAQUET - MARGE));
    if (nx !== x || ny !== y) poser(paquet, nx, ny);
}

/**
 * Pose un paquet qu'on vient d'ouvrir : en cascade légère depuis le
 * précédent si la place est libre, sinon dans la place la plus libre.
 * @param {HTMLElement} paquet
 * @param {HTMLElement | null} precedent  le paquet ouvert juste avant
 */
export function placerPaquet(paquet, precedent) {
    paquet.setAttribute('data-placement', '');
    const zone = zoneJeu();
    const { width, height } = paquet.getBoundingClientRect();
    const l = width + BORDS_PAQUET;
    const h = height + BORDS_PAQUET;
    let choix = null;
    if (precedent) {
        const p = position(precedent);
        const x = p.x + CASCADE.x;
        const y = p.y + CASCADE.y;
        const tient = x + l <= zone.largeur - MARGE && y + h <= zone.hauteur - MARGE;
        if (tient && !toucheUnBord(x, y, l, h)) choix = { x, y };
    }
    choix ??= placeLibre(l, h, null, POIDS);
    poser(paquet, Math.max(MARGE, Math.min(choix.x, zone.largeur - l - MARGE)), Math.max(MARGE, Math.min(choix.y, zone.hauteur - h - MARGE)));
    auPremierPlan(paquet);
    paquet.removeAttribute('data-placement');
}

/**
 * Glisser un paquet par l'en-tête de sa carte visible.
 * @param {HTMLElement} paquet
 * @param {() => boolean} actif  faux sur téléphone (carrousel)
 */
export function rendreDeplacable(paquet, actif) {
    let depart = { px: 0, py: 0, x: 0, y: 0 };
    /** @type {HTMLElement | null} */
    let poignee = null;

    paquet.addEventListener('pointerdown', (e) => {
        if (!actif() || e.button !== 0 || !(e.target instanceof Element)) return;
        const tete = e.target.closest('.carte__tete');
        if (!(tete instanceof HTMLElement) || e.target.closest('button')) return;
        const p = position(paquet);
        depart = { px: e.clientX, py: e.clientY, x: p.x, y: p.y };
        poignee = tete;
        tete.setPointerCapture(e.pointerId);
        e.preventDefault();
    });
    paquet.addEventListener('pointermove', (e) => {
        if (!poignee) return;
        const zone = zoneJeu();
        const largeur = paquet.offsetWidth;
        const x = Math.min(Math.max(PRISE - largeur, depart.x + e.clientX - depart.px), zone.largeur - PRISE);
        const y = Math.min(Math.max(0, depart.y + e.clientY - depart.py), zone.hauteur - PRISE / 2);
        poser(paquet, x, y);
    });
    const lacher = () => { poignee = null; };
    paquet.addEventListener('pointerup', lacher);
    paquet.addEventListener('pointercancel', lacher);
}
